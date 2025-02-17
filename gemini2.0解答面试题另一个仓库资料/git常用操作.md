好的，面试官，关于 Git 的常见操作，我将按照日常开发流程进行分类，并详细介绍每个操作的用法和注意事项：

**1. 初始化与配置**

*   **`git init`**:
    *   **作用：** 在当前目录初始化一个新的 Git 仓库。
    *   **用法：**
        ```bash
        git init [repository-name]
        ```
        如果不提供 `repository-name`，则在当前目录初始化仓库。
    *   **注意：** 这会在当前目录下创建一个 `.git` 子目录，用于存储 Git 的版本控制信息。
*   **`git clone`**:
    *   **作用：** 克隆（下载）一个远程仓库到本地。
    *   **用法：**
        ```bash
        git clone <repository-url> [local-directory-name]
        ```
        如果不提供 `local-directory-name`，则使用远程仓库的名称作为本地目录名。
    *   **注意：** 这会下载远程仓库的所有分支和历史记录。
*   **`git config`**:
    *   **作用：** 配置 Git 的用户信息、编辑器、行为等。
    *   **用法：**
        ```bash
        # 设置用户名
        git config --global user.name "Your Name"

        # 设置邮箱
        git config --global user.email "your.email@example.com"

        # 设置默认编辑器
        git config --global core.editor "vim"

        # 查看配置
        git config --list
        # 查看特定配置
        git config user.name
        ```
    *   **注意：**
        *   `--global` 选项表示全局配置，对当前用户的所有仓库生效。
        *   如果不使用 `--global`，则配置只对当前仓库生效。
        *   配置信息存储在 `~/.gitconfig`（全局）和 `.git/config`（仓库）文件中。

**2. 基本操作（增删改查）**

*   **`git status`**:
    *   **作用：** 查看工作区和暂存区的状态。
    *   **用法：**
        ```bash
        git status
        ```
    *   **注意：** 这会显示：
        *   当前所在分支。
        *   未跟踪的文件 (Untracked files)。
        *   已修改但未暂存的文件 (Changes not staged for commit)。
        *   已暂存但未提交的文件 (Changes to be committed)。
*   **`git add`**:
    *   **作用：** 将文件添加到暂存区。
    *   **用法：**
        ```bash
        git add <file1> <file2> ...  # 添加指定文件
        git add .                   # 添加所有修改和未跟踪的文件
        git add -u                  # 添加所有修改的文件（不包括未跟踪的文件）
        git add -A                  # 等同于 git add .
        ```
    *   **注意：** `git add` 不会将文件提交到仓库，只是将其添加到暂存区。
*   **`git commit`**:
    *   **作用：** 将暂存区的文件提交到仓库。
    *   **用法：**
        ```bash
        git commit -m "Commit message"  # 提交并添加提交信息
        git commit                      # 提交并打开编辑器编写提交信息
        git commit -am "Commit message" # 将所有已修改的文件添加到暂存区并提交
        ```
    *   **注意：**
        *   提交信息应该清晰、简洁地描述本次提交的变更。
        *   好的提交信息可以方便代码审查和问题追踪。
*   **`git diff`**:
    *   **作用：** 查看工作区、暂存区或不同提交之间的差异。
    *   **用法：**
        ```bash
        git diff             # 查看工作区与暂存区的差异
        git diff --staged    # 查看暂存区与上次提交的差异
        git diff <commit1> <commit2> # 查看两个提交之间的差异
        git diff <branch1> <branch2> # 查看两个分支之间的差异
        git diff -- <file>  # 查看特定文件的差异
        ```
    *   **注意：** `git diff` 可以帮助我们了解代码的变更情况。
*   **`git rm`**:
    *   **作用：** 从工作区和暂存区删除文件。
    *   **用法：**
        ```bash
        git rm <file>
        git rm -r <directory>  # 递归删除目录
        ```
    *   **注意：**
        *   `git rm` 会同时删除工作区和暂存区的文件。
        *   如果只想从暂存区删除文件，保留工作区的文件，使用 `git rm --cached <file>`。
*   **`git mv`**:
    *   **作用：** 重命名或移动文件。
    *   **用法：**
        ```bash
        git mv <old-name> <new-name>
        ```
    *   **注意：** `git mv` 相当于执行了 `mv <old-name> <new-name>` 和 `git add <new-name>`。
*   **`git log`**:
      *   **作用**: 查看提交历史。
      *  **用法**:
        ```bash
        git log
        git log --oneline # 每个提交只显示一行
        git log -p # 显示每个提交的差异
        git log --stat # 显示每个提交的统计信息
        git log --author="Author Name" # 显示特定作者的提交
        git log --grep="commit message" # 显示包含特定信息的提交
        git log <file> # 显示特定文件的提交历史
        ```

**3. 分支管理**

*   **`git branch`**:
    *   **作用：** 列出、创建、删除分支。
    *   **用法：**
        ```bash
        git branch        # 列出本地分支
        git branch -r     # 列出远程分支
        git branch -a     # 列出所有分支（本地和远程）
        git branch <branch-name> # 创建新分支
        git branch -d <branch-name> # 删除分支（已合并）
        git branch -D <branch-name> # 强制删除分支（未合并）
        ```
    *   **注意：**
        *   `*` 号表示当前所在分支。
        *   删除分支时，Git 会检查该分支是否已合并到其他分支，以防止误删。
*   **`git checkout`**:
    *   **作用：** 切换分支或恢复工作区文件。
    *   **用法：**
        ```bash
        git checkout <branch-name>   # 切换到指定分支
        git checkout -b <branch-name>  # 创建并切换到新分支
        git checkout -- <file>      # 恢复工作区文件到上次提交的状态
        ```
    *   **注意：**
        *   切换分支前，确保工作区是干净的（没有未提交的修改），否则可能会导致冲突。
        *   `git checkout -- <file>` 会丢弃工作区对该文件的修改，谨慎使用。
*   **`git switch`** (Git 2.23+):
  * **作用**: 切换分支，与`git checkout`相比，职责更清晰。
  * **用法**:
      ```bash
      git switch <branch-name>
      git switch -c <branch-name> # 创建并切换到新分支, 相当于checkout -b
      ```
*   **`git merge`**:
    *   **作用：** 将指定分支合并到当前分支。
    *   **用法：**
        ```bash
        git merge <branch-name>
        ```
    *   **注意：**
        *   合并前，确保当前分支是干净的。
        *   合并可能会产生冲突，需要手动解决冲突。
*   **`git rebase`**:
    *   **作用：** 将当前分支的提交变基到另一个分支上。
    *   **用法：**
        ```bash
        git rebase <branch-name>
        ```
    *   **注意：**
        *   `rebase` 会改写提交历史，不要对已推送到远程仓库的提交进行 `rebase`。
        *   `rebase` 可以使提交历史更线性、更清晰。
*   **`git cherry-pick`**:
    *   **作用**：将指定的提交应用到当前分支。
    *   **用法**:
      ```bash
      git cherry-pick <commit-hash>
      ```

**4. 远程协作**

*   **`git remote`**:
    *   **作用：** 管理远程仓库。
    *   **用法：**
        ```bash
        git remote -v             # 查看远程仓库列表
        git remote add <name> <url> # 添加远程仓库
        git remote remove <name>  # 删除远程仓库
        git remote rename <old-name> <new-name> # 重命名远程仓库
        ```
    *   **注意：**
        *   通常，远程仓库的默认名称是 `origin`。
*   **`git fetch`**:
    *   **作用：** 从远程仓库获取最新的分支和提交，但不合并到本地分支。
    *   **用法：**
        ```bash
        git fetch <remote-name>  # 获取指定远程仓库的所有分支
        git fetch --all          # 获取所有远程仓库的所有分支
        ```
    *   **注意：** `git fetch` 不会修改本地分支，只是更新本地的远程分支跟踪。
*   **`git pull`**:
    *   **作用：** 从远程仓库获取最新的分支和提交，并合并到当前分支。
    *   **用法：**
        ```bash
        git pull <remote-name> <branch-name>
        git pull                  # 相当于 git fetch origin + git merge origin/当前分支
        ```
    *   **注意：**
        *   `git pull` 相当于 `git fetch` + `git merge`。
        *   如果远程分支与本地分支有冲突，需要手动解决冲突。
*   **`git push`**:
    *   **作用：** 将本地分支的提交推送到远程仓库。
    *   **用法：**
        ```bash
        git push <remote-name> <branch-name> # 推送指定分支
        git push -u origin <branch-name>  # 首次推送并设置上游分支
        git push --all <remote-name>      # 推送所有分支
        git push --tags <remote-name>     # 推送所有标签
        git push origin --delete <branch-name> # 删除远程分支
        ```
    *   **注意：**
        *   首次推送时，需要使用 `-u` 选项设置上游分支，之后可以直接使用 `git push`。
        *   如果远程仓库有更新，需要先 `git pull`，再 `git push`。
        *   避免强制推送（`git push -f`），除非你确定自己在做什么。

**5. 标签管理**

*   **`git tag`**:
    *   **作用：** 创建、列出、删除标签。
    *   **用法：**
        ```bash
        git tag            # 列出所有标签
        git tag <tag-name> # 创建轻量级标签（lightweight tag）
        git tag -a <tag-name> -m "Tag message" # 创建附注标签（annotated tag）
        git tag -d <tag-name> # 删除标签
        git show <tag-name> #显示标签信息
        ```
    *   **注意：**
        *   标签通常用于标记重要的提交，如版本发布。
        *   轻量级标签只是一个指向提交的引用，而附注标签是一个完整的对象，包含标签信息、创建者、日期等。

**6. 其他常用命令**

*   **`git stash`**:
    *   **作用：** 暂存工作区的修改，以便切换分支或执行其他操作。
    *   **用法：**
        ```bash
        git stash          # 暂存所有修改
        git stash push -m "Stash message" # 暂存并添加消息
        git stash list     # 查看暂存列表
        git stash apply    # 应用最近的暂存
        git stash pop      # 应用最近的暂存并删除
        git stash drop     # 删除最近的暂存
        git stash clear # 清除所有暂存
        ```
    *   **注意：** `git stash` 可以帮助我们在不提交修改的情况下切换分支或执行其他操作。
*   **`git reset`**:
    *    **作用:** 撤销提交, 将 HEAD 指针移动到指定的提交。
    *    **用法**:
        ```bash
            git reset --soft <commit> # 撤销提交，保留暂存区和工作区
            git reset --mixed <commit> # 撤销提交，保留工作区，清空暂存区（默认）
            git reset --hard <commit> # 撤销提交，清空暂存区和工作区
        ```
    * **注意**:
      * `--soft`、`--mixed`、`--hard` 决定了撤销的程度。
      *  `git reset` 会修改提交历史，谨慎使用。
*   **`git revert`**:
    *   **作用：** 创建一个新的提交来撤销指定的提交。
    *   **用法：**
        ```bash
        git revert <commit>
        ```
    *   **注意：**
        *   `git revert` 不会修改提交历史，而是创建一个新的提交来撤销之前的修改。
        *   `git revert` 更安全，适用于撤销已推送到远程仓库的提交。
*   **`git clean`**:
    * **作用**: 删除未跟踪的文件。
    * **用法**:
      ```bash
      git clean -n # 预览将要删除的文件
      git clean -f # 强制删除未跟踪的文件
      git clean -d # 删除未跟踪的目录
      ```
    * **注意**:
      * `-n` 选项可以预览将要删除的文件，建议先预览再执行删除操作。
      *  `git clean` 是一个不可逆的操作，谨慎使用。

**7. 高级操作**

*   **交互式 rebase (`git rebase -i`)**:
    *   可以用于合并、修改、删除、调整提交顺序。
*   **子模块 (`git submodule`)**:
    *   用于管理项目中的子项目。
*   **子树 (`git subtree`)**:
    *   用于将一个仓库的代码合并到另一个仓库的子目录中。
*   **钩子 (`git hooks`)**:
    *   用于在 Git 操作的特定时机执行自定义脚本。

**总结**

Git 是一个功能强大的版本控制系统，掌握其常见操作对于开发人员至关重要。上述列出的命令涵盖了 Git 的大部分常用功能，熟练掌握这些命令可以帮助我们高效地进行代码管理和团队协作。当然，Git 还有许多高级功能，可以在实践中逐步学习和掌握。
