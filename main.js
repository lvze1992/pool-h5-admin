// https://zhuanlan.zhihu.com/p/86309704
// 引入electron并创建一个Browserwindow
// https://blog.csdn.net/jbguo/article/details/90209297
// https://cloudconvert.com/png-to-icns
const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');
// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow;
function createWindow() {
  //创建浏览器窗口,宽高自定义具体大小你开心就好
  mainWindow = new BrowserWindow({ width: 1400, height: 900 });
  /*
   * 加载应用----- electron-quick-start中默认的加载入口
   */
  // dev
  // mainWindow.loadURL('http://localhost:4001/');
  // mainWindow.webContents.openDevTools();
  // pro
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './build/index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  );

  // 关闭window时触发下列事件.
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}
// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
// protocol.interceptFileProtocol(
//   'file',
//   (request, callback) => {
//       const url = request.url.substr(7) // strip "file://" out of all urls
//       if (request.url.endsWith(indexFile)) {
//           callback({ path: url })
//       } else {
//           callback({ path: path.normalize(`${__dirname}/${htmlRootDir}/${url}`) })
//       }
//   },
//   error => console.error(error)
// )
//file:///Users/lvze/pool/admin/out/admin-darwin-x64/admin.app/Contents/Resources/app.asar/build/index.html
app.on('ready', createWindow);
// 所有窗口关闭时退出应用.
app.on('window-all-closed', function () {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (mainWindow === null) {
    createWindow();
  }
});
// 你可以在这个脚本中续写或者使用require引入独立的js文件.
