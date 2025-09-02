// 注意要安装@actions/github依赖
import { context, getOctokit } from "@actions/github";
import { readFile } from "node:fs/promises";

// 在容器中可以通过env环境变量来获取参数
const octokit = getOctokit(process.env.GITHUB_TOKEN);

const updateRelease = async () => {

  // 获取当前版本的 tag 名称（去掉 refs/tags/v 前缀）
  let currentTag;
  if (context.ref.startsWith('refs/tags/')) {
    currentTag = context.ref.replace('refs/tags/v', '');
  } else if (context.eventName === 'release') {
    // 如果是 release 事件，从 release 信息中获取 tag
    currentTag = context.payload.release.tag_name.replace('v', '');
  } else {
    throw new Error('无法确定版本号');
  }

  console.log(`output->current tag: ${currentTag}`);

  // 获取updater tag的release
  const { data: release } = await octokit.rest.repos.getReleaseByTag({
    owner: context.repo.owner,
    repo: context.repo.repo,
    tag: `v${currentTag}`,
  });
  // 删除旧的的文件
  const deletePromises = release.assets
    .filter((item) => item.name === "latest.json")
    .map(async (item) => {
      await octokit.rest.repos.deleteReleaseAsset({
        owner: context.repo.owner,
        repo: context.repo.repo,
        asset_id: item.id,
      });
    });

  await Promise.all(deletePromises);

  // 上传新的文件
  const file = await readFile("latest.json", { encoding: "utf-8" });

  await octokit.rest.repos.uploadReleaseAsset({
    owner: context.repo.owner,
    repo: context.repo.repo,
    release_id: release.id,
    name: "latest.json",
    data: file,
  });
};

updateRelease();
