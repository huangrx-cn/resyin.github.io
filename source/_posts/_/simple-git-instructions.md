---
title: 简易的 Git 使用
tags: [Git,GitHub]
categories: "Git"
comments: true
---

# 简介

Git 是一款免费开源的分布式版本控制系统。区别于 Subversion 等版本控制系统将它们保存的信息看作是一组基本文件和每个文件随时间逐步累积的差异，而是对当时的全部文件制作一个快照并保存这个快照的索引。

<!-- more -->

## <span id="jump1">文件处于 Git 中的状态</span>

- 已提交（committed），数据已经安全的保存在本地数据库中
- 已修改（modified），修改了文件，但还没保存到数据库中
- 已暂存（staged），对一个已修改文件的当前版本做了标记，使之包含在下次提交的快照中

## 基本的 Git 工作流程

1. 在工作目录中修改文件

2. 暂存文件，将文件的快照放入暂存区域

3. 提交更新，找到暂存区域的文件，将快照永久性存储到 Git 仓库目录

## 安装

- [在 Linux 上安装](http://git-scm.com/download/linux)
- [在 Mac 上安装](http://git-scm.com/download/mac)
- [在 Windows 上安装]( http://git-scm.com/download/win)

## Git 的初始配置

Git 自带一个 git config 的工具来帮助设置控制 Git 外观和行为的配置变量。 这些变量存储在三个不同的位置：

1. /etc/gitconfig 文件: 包含系统上每一个用户及他们仓库的通用配置。 如果使用带有 --system 选项的 git config 时，它会从此文件读写配置变量

2. ~/.gitconfig 或 ~/.config/git/config 文件：只针对当前用户。 可以传递 --global 选项让 Git 读写此文件

3. 当前使用仓库的 Git 目录中的 config 文件（就是 .git/config）：针对该仓库

且每一个级别覆盖上一级别的配置。

- 查看你的配置信息： `$ git config --list `

- 用户配置
 - 配置用户名：`$ git config --global user.name "Your Name"` 
 - 配置用户邮箱：`$ git config --global user.email yourname@example.com` 

- 文本编辑器配置
 - 配置你的编辑器为 EMACS：`$ git config --global core.editor emacs` 

- 其他配置请参考以上

## 获取帮助

可以查看更加详细的 Git 使用方式。

- 获取 Git 命令列表： `$ git`
- 获取 Git 命令帮助： `$ git help <verb>` ，如 `$ git help config`

# Git 本地仓库操作

## 初始化 Git 仓库

使当前目录初始化为一个 Git 仓库： `$ git init` 。

## 状态文件查看

查看目录下文件在 Git 中的[状态](#jump1)： `$ git status` 。

## 添加文件到暂存区

Git 会提示 Untracked files 来展示未暂存的文件，添加文件到暂存区： `$ git add <file name>` ，如添加 README.md 文件： `$ git add README.md` 。

添加所有未暂存的文件到暂存区： `$ git add .` 。

## 还原修改且未暂存的文件

修改暂存区的文件后，文件状态会回到未暂存。可以使用： `$ git checkout <file name>` ，文件会还原到之前在暂存区时的文件。

该命令十分危险，你所有的更改将会消失并且不可挽回。

## 查看修改且未暂存文件的详细差异信息

虽然 `$ git status` 可以展示文件的状态，但是不能显示具体的改动。

使用 `$ git diff` 可以查看曾在暂存区修改后未暂存文件在修改前后的详细差异信息。

## 查看已暂存但未提交的详细差异信息

文件在一次提交后，经过修改再次存到暂存区，使用 `$ git diff --staged` 可以查看上次提交与当前暂存文件的详细差异信息。

## 将已暂存的文件移除暂存区

`$ git rm --cached <file name>` ， 如： `$ git rm --cached README.md` 。  

## 提交暂存区文件到本地仓库

`$ git commit -m 'message'` 。 message为提交时必填的附加信息。

## 更改提交

在提交后，发现提交了不需要提交的文件，或者遗漏了要提交的文件，可以在调整暂存区文件后： `$ git commit --amend` ，该命令会使你的本次提交覆盖上次提交。

## 查看提交记录

查看 commit 记录和附加信息： `$ git log` 。

## 查看分支

`$ git init` 后， Git 会创建默认分支 master ，但是一般我们并不在其上进行开发，而是新建分支来开发，开发完成后将分支合并到 master 下。

用 `$ git branch` 可以查看当前的分支状态。

## 新建分支

`$ git branch <branch name>` ，如创建一个名为 dev 的分支： `$ git branch dev` 。

## 删除分支

`git branch -d <branch name>` ，如删除一个名为 dev 的分支： `git branch -d dev` 。

如果要删除的分支还没有合并到 master 下，使用以上命令删除会失败，但是可以强制删除：
`git branch -D <branch name>` 。

## 切换分支

`$ git checkout <branch name>` ，如从 master 切换到 dev ： `$ git checkout dev` 。

也可以在新建分支的时候就切换到该分支，如： `$ git checkout -b dev` 。

## 合并分支

当在开发分支开发完毕后需要合并到主分支时，首先切换到主分支，然后： `$ git merge <dev branch name>` 将开发分支合并到主分支。

`$ git rebase <dev branch name>` 也可以合并分支，这种方式会以时间排序。

## 标签

标签的意义在于可以精准定位不同时段的代码。

建立标签： `$ git tag <tag name>` ，例如设置当前代码为 V1 版本： `$ git tag V1`  ;经过一段时间的开发后可以设置代码为 V2 版本： `$ git tag V2` 。

查看标签：`$ git tag` 。

切换标签：可以通过 `$ git checkout <tag name>` 来切换不同时段的代码，如在开发过程中想回到 V1 时段的代码：`$ git checkout V1` 。

# Git 远程仓库操作

## 本地仓库与远程仓库的关联

### 注册GitHub

在[GitHub](https://github.com/)注册你的账户，需要提供用户名、密码、邮箱。

### 生成SSH KEY

`$ ssh` 确认你是否安装了SSH，如果出现 `usage:ssh...` 则证明你已安装，若未安装请砸电脑。

然后用 `$ ssh-keygen -t rsa` (回车回车回车...)在 `~/.ssh`（Linux/Mac）或 `C:\Users\<...>/.ssh` (Windows 7)目录下生成私钥 `id_rsa` 与公钥 `id_rsa.pub`。打开 `id_rsa.pub` 并复制公钥内容。

### 绑定SSH

在GitHub中依次：右上角头像旁 ▼-->Settings-->Personal settings-->SSH and GPG keys-->New SSH key。

将你复制的公钥内容粘贴在出现的Key文本框中，Title文本框中请随意填写。

### 测试

`$ ssh -T git@github.com` ,若让你yes请输入yes，不要输入y。然后你会看见 `Hi Gril! You've successfully authenticated...` 。

## 远程操作

### 在本地克隆远程仓库

`$ git clone <SSH>` 。把一个存在的远程仓库克隆到本地。SSH 可以在 GitHub 的仓库内 Clone or download 下找到。克隆的仓库已经是一个 Git 仓库，不需要初始化操作。

### 添加本地仓库为远程仓库

首先，需要在 GitHub 上建立一个新的仓库，这个新的仓库会提供一个 SSH。

`$ git remote add <repository name> <SSH>` ，例如：`$ git remote add origin git@github.com:yourname/test.git` 。

### 查看远程仓库

`$ git remote` 。一个本地仓库可以对应多个远程仓库，该命令会返回该本地仓库关联的所有远程仓库。

### 提交到远程仓库

`$  git push <repository name> <branch name>` ，例如：`$  git push origin master` 。 `origin` 为默认的远程仓库名，`master` 是默认分支 master 。如果提交到其他分支，可换成其他分支名；如果提交到其他远程仓库，可换成其他远程仓库名。

### 同步远程仓库

`$ git pull <repository name> <branch name>` ，例如：`$  git pull origin master` 。将远程仓库同步到本地，一般情况下都是先 pull 再 push ，避免冲突。

注意： `$ git pull` 与 `$ git fetch` 都会将远程仓库同步到本地。区别在于 `$ git pull` 会将远程仓库与本地仓库做合并操作，而 `$ git fetch` 只会将仓库同步到本地不做任何操作。相对来说， `$ git fetch` 会更加安全些。


# 参考 & 引用

 - [Git Book](https://git-scm.com/doc)
 - [stormzhang](http://stormzhang.com/) 的 [从0开始学习 GitHub](http://stormzhang.com/github/2016/06/19/learn-github-from-zero-summary/)
 - [廖雪峰](http://www.liaoxuefeng.com/) 的 [Git教程](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)





















