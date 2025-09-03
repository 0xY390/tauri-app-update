<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getVersion } from '@tauri-apps/api/app';
import { invoke } from '@tauri-apps/api/core';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

const version = ref('');
const updateStatus = ref('');
const isChecking = ref(false);
const isUpdating = ref(false);

onMounted(async () => {
  version.value = await getVersion();
});

async function checkForUpdates() {
  try {
    isChecking.value = true;
    updateStatus.value = '正在检查更新...';

    console.log(`output->check`, check);
    const update = await check();
    console.log(`output->update`, update);
    if (update) {
      // await update.downloadAndInstall()
      console.log(`found update ${update.version} from ${update.date} with notes ${update.body}`);
      // let downloaded = 0;
      // let contentLength = 0;
      // alternatively we could also call update.download() and update.install() separately
      // await update.downloadAndInstall();

      console.log(`downloading update ${update.version}`);
      await update.download();
      console.log(`installing update ${update.version}`);
      await update.install();

      console.log('update installed');
      await relaunch();
    }
    updateStatus.value = '更新检查完成';
  } catch (error) {
    console.log(`output->error`, error);
    updateStatus.value = `更新失败: ${error}`;
  } finally {
    isChecking.value = false;
  }
}

async function getCurrentVersion() {
  try {
    const currentVersion = await invoke('get_current_version');
    version.value = currentVersion as string;
  } catch (error) {
    console.error('获取版本失败:', error);
  }
}
</script>

<template>
  <main class="container">
    <h1>欢迎使用 Tauri + Vue</h1>
    <div class="version-info">
      <h2>当前版本: {{ version }}</h2>
      <p class="update-status">{{ updateStatus }}</p>
    </div>

    <div class="actions">
      <button @click="checkForUpdates" :disabled="isChecking || isUpdating" class="update-btn">
        {{ isChecking ? '检查中...' : '检查更新' }}
      </button>

      <button @click="getCurrentVersion" class="version-btn">刷新版本信息</button>
    </div>

    <div class="info-panel">
      <h3>更新说明</h3>
      <ul>
        <li>点击"检查更新"按钮检查是否有新版本可用</li>
        <li>如果有更新，系统会自动下载并安装</li>
        <li>更新完成后应用会自动重启</li>
        <li>请确保在更新过程中不要关闭应用</li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
.container {
  margin: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.version-info {
  text-align: center;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.update-status {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.update-btn,
.version-btn {
  padding: 0.8em 1.5em;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.update-btn {
  background: linear-gradient(45deg, #4caf50, #45a049);
  color: white;
}

.update-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.update-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.version-btn {
  background: linear-gradient(45deg, #2196f3, #1976d2);
  color: white;
}

.version-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.info-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 500px;
  text-align: left;
}

.info-panel h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #fff;
}

.info-panel ul {
  margin: 0;
  padding-left: 1.5rem;
}

.info-panel li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .actions {
    flex-direction: column;
    align-items: center;
  }

  .update-btn,
  .version-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>
