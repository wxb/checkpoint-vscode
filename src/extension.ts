import * as vscode from 'vscode';
import { CheckpointManager } from './checkpointManager';
import { CheckpointCodeLensProvider } from './codeLensProvider';

export function activate(context: vscode.ExtensionContext) {
  const manager = CheckpointManager.getInstance();
  const codeLensProvider = new CheckpointCodeLensProvider();

  // 注册 CodeLens 提供器
  const codeLensDisposable = vscode.languages.registerCodeLensProvider(
    { pattern: '**/*' },
    codeLensProvider
  );

  // 注册添加检查点命令
  const addCheckpointCommand = vscode.commands.registerCommand(
    'checkpoint.addCheckpoint',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('请先打开一个文件');
        return;
      }

      const position = editor.selection.active;
      const line = position.line;
      const filePath = editor.document.uri.fsPath;

      // 检查是否已存在检查点
      const existingCheckpoint = manager.getCheckpoint(filePath, line);
      if (existingCheckpoint) {
        const overwrite = await vscode.window.showWarningMessage(
          `该位置已存在检查点: "${existingCheckpoint.message}"`,
          '覆盖',
          '取消'
        );
        if (overwrite !== '覆盖') {
          return;
        }
      }

      // 输入检查点信息 - 使用 createInputBox 获得更多控制
      const inputBox = vscode.window.createInputBox();
      inputBox.prompt = '请输入检查点提示信息（例如：上线前检查字段是否已添加）';
      inputBox.placeholder = '检查点提示信息';
      inputBox.value = existingCheckpoint?.message || '';
      inputBox.ignoreFocusOut = true;
      
      // 设置验证
      inputBox.onDidChangeValue((value) => {
        if (!value || value.trim().length === 0) {
          inputBox.validationMessage = '检查点信息不能为空';
        } else {
          inputBox.validationMessage = undefined;
        }
      });
      
      // 等待用户输入
      const message = await new Promise<string | undefined>((resolve) => {
        inputBox.onDidAccept(() => {
          resolve(inputBox.value);
          inputBox.hide();
        });
        inputBox.onDidHide(() => {
          resolve(undefined);
        });
        inputBox.show();
      });

      if (!message) {
        return;
      }

      // 添加检查点
      const checkpoint = manager.addCheckpoint(filePath, line, message.trim());
      
      // 刷新 CodeLens
      codeLensProvider.refresh();

      vscode.window.showInformationMessage(
        `检查点已添加 [${checkpoint.branch}]: ${checkpoint.message}`
      );
    }
  );

  // 注册移除检查点命令
  const removeCheckpointCommand = vscode.commands.registerCommand(
    'checkpoint.removeCheckpoint',
    async (args?: { filePath: string; line: number }) => {
      let filePath: string;
      let line: number;

      if (args) {
        // 从命令参数中获取
        filePath = args.filePath;
        line = args.line;
      } else {
        // 从当前编辑器获取
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showWarningMessage('请先打开一个文件');
          return;
        }
        filePath = editor.document.uri.fsPath;
        line = editor.selection.active.line;
      }

      const checkpoint = manager.getCheckpoint(filePath, line);
      if (!checkpoint) {
        vscode.window.showWarningMessage('该位置没有检查点');
        return;
      }

      const confirm = await vscode.window.showWarningMessage(
        `确定要移除检查点 "${checkpoint.message}" 吗？`,
        '确定',
        '取消'
      );

      if (confirm === '确定') {
        manager.removeCheckpoint(filePath, line);
        
        // 刷新 CodeLens
        codeLensProvider.refresh();

        vscode.window.showInformationMessage('检查点已移除');
      }
    }
  );

  // 注册查看所有检查点命令
  const viewCheckpointsCommand = vscode.commands.registerCommand(
    'checkpoint.viewCheckpoints',
    async () => {
      const checkpoints = manager.getAllCheckpoints();
      
      if (checkpoints.length === 0) {
        vscode.window.showInformationMessage('当前没有检查点');
        return;
      }

      // 按分支分组
      const branchGroups = new Map<string, typeof checkpoints>();
      checkpoints.forEach(cp => {
        const group = branchGroups.get(cp.branch) || [];
        group.push(cp);
        branchGroups.set(cp.branch, group);
      });

      // 创建快速选择项
      const items: vscode.QuickPickItem[] = [];
      branchGroups.forEach((group, branch) => {
        items.push({
          label: `$(git-branch) ${branch}`,
          kind: vscode.QuickPickItemKind.Separator
        });
        
        group.forEach(cp => {
          const fileName = cp.filePath.split(/[\\/]/).pop() || cp.filePath;
          items.push({
            label: `$(debug-breakpoint) ${cp.message}`,
            description: `${fileName}:${cp.line + 1}`,
            detail: cp.filePath
          });
        });
      });

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: '选择检查点进行跳转（按分支分组）',
        matchOnDescription: true,
        matchOnDetail: true
      });

      if (selected && selected.detail) {
        const checkpoint = checkpoints.find(
          cp => cp.filePath === selected.detail && cp.message === selected.label.replace('$(debug-breakpoint) ', '')
        );
        
        if (checkpoint) {
          const document = await vscode.workspace.openTextDocument(checkpoint.filePath);
          const editor = await vscode.window.showTextDocument(document);
          
          const position = new vscode.Position(checkpoint.line, 0);
          editor.selection = new vscode.Selection(position, position);
          editor.revealRange(
            new vscode.Range(position, position),
            vscode.TextEditorRevealType.InCenter
          );
        }
      }
    }
  );

  // 注册文件保存监听器 - 刷新 CodeLens
  const onSaveDisposable = vscode.workspace.onDidSaveTextDocument(() => {
    codeLensProvider.refresh();
  });

  // 注册文件切换监听器
  const onChangeEditorDisposable = vscode.window.onDidChangeActiveTextEditor(() => {
    codeLensProvider.refresh();
  });

  // 注册 checkpoint.json 文件变化监听器
  const config = vscode.workspace.getConfiguration('checkpoint');
  const checkpointFilename = config.get<string>('filename', 'checkpoint.json');
  const checkpointFileWatcher = vscode.workspace.createFileSystemWatcher(`**/${checkpointFilename}`);
  
  checkpointFileWatcher.onDidChange(() => {
    // checkpoint.json 文件发生变化，重新加载并刷新 CodeLens
    manager.refresh();
    codeLensProvider.refresh();
  });
  
  checkpointFileWatcher.onDidCreate(() => {
    // checkpoint.json 文件被创建，重新加载
    manager.refresh();
    codeLensProvider.refresh();
  });
  
  checkpointFileWatcher.onDidDelete(() => {
    // checkpoint.json 文件被删除，清空检查点
    manager.refresh();
    codeLensProvider.refresh();
  });

  // 将所有命令和监听器添加到订阅
  context.subscriptions.push(
    codeLensDisposable,
    addCheckpointCommand,
    removeCheckpointCommand,
    viewCheckpointsCommand,
    onSaveDisposable,
    onChangeEditorDisposable,
    checkpointFileWatcher
  );

  // 初始化时刷新 CodeLens
  codeLensProvider.refresh();

  console.log('Checkpoint 插件已激活');
}

export function deactivate() {
  console.log('Checkpoint 插件已停用');
}
