---
title: Syncing a fork
tags: [GIT]
categories: "GIT"
comments: true
---

当 fork 的项目更新时，可以通过下面的方式将作者的分支同步到自己的分支：

- `git clone https://github.com/your_name/project_name.git`

- `git remote -v`

<!-- more -->

- `git remote add project_name https://github.com/author_name/project_name.git`

- `git remote -v`

- `git fetch project_name`

- `git branch -av`

- `git merge project_name/master`

- `git push origin master`


或者：
[Syncing a fork][1]


  [1]: https://help.github.com/articles/syncing-a-fork/