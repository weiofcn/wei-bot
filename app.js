const WechatAPI = require('co-wechat-api');
const wechat = require('co-wechat');
const Koa = require('koa');
const config = require('./config');

const cnblogs = require('./cnblogs')

const app = new Koa();

// Read wechat official account config 
const configFile = './wei-bot.json';
let wechatOpt = null;
const wechatAccount = config.wechat.account(configFile);
if (!wechatAccount) {
  console.log('You have a wrong config file.')
  return;
} else {
  wechatOpt = new WechatAPI(wechatAccount.appid, wechatAccount.appsecret);
}

let unreadMsg = [];

// initial wechat menu
wechatOpt.createMenu(config.wechat.menu(configFile));

app.use(wechat(wechatAccount).middleware(async(message, ctx) => {
  //console.log(message);

  if (message.FromUserName !== 'o3fEm1JaSUjHt__ajqtynH-Q2sSA') {
    return 'https://github.com/weiofcn/wei-bot';
  }

  if (message.MsgType === 'event') {
    if (message.Event === 'CLICK') {
      switch (message.EventKey) {
        case 'unreadMsg':
          {
            let msg = unreadMsg.shift();
            if (msg) return msg;
            else return '消息已读完'
          }
          break;
        case 'updateMenu':
          {
            wechatOpt.removeMenu(function(err, result) {
              console.log('Remove menu:', result)
            });

            let wechatMenu = config.wechat.menu(configFile)
            if (!wechatMenu) {
              return '配置菜单栏文件中的语法格式不对。'
            }

            wechatOpt.createMenu(wechatMenu);

            return '菜单栏更新成功，重新订阅查看效果或者等待5分钟。';
          }
          break;
        case 'cnblogNews':
          {
            let numberOfOnce = 10;
            let content = [];
            let news = await cnblogs.fetchTitleAndUrl();

            news.forEach(function(item, index) {
              content.push(`${index+1}. ${item.title}\n${item.href}\n`);
            });

            for (let i = 0; i < content.length; i++) {
              if (((i % numberOfOnce) === 0) && (i > 0)) {
                unreadMsg.push(content.slice(i, i + numberOfOnce).join(''));
              }
            }
            return content.slice(0, numberOfOnce).join('');
          }
          break;
        default:
          break;
      }
    } else if (message.Event === 'subscribe') {
      return '订阅成功！';
    }
  } else if (message.MsgType === 'text') {
    return '🔨';
  } else {
    return '消息类型还未被支持';
  }

}));

app.listen(80);