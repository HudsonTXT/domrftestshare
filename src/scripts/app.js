const SHARE_DATA = {
  title: 'Это поле title',
  text: `Хорошие новости для тех, у кого больше 2 детей и ипотечный кредит.
  Недавно мы получили помощь от государства на погашение ипотеки. И вы можете получить до 450 тысяч, если ваш третий ребёнок родился после 01.01.19.
  Заявления и документы принимают банки, выдающие ипотеку. Уточнить информацию можно в ДОМ.РФ: 8 800 775-11-22 - они помогут.
  #домрф450, #гасимипотеку450`,
  //imgUrl: window.location + 'images/share-cover.jpg'
  img: 'https://xn--h1alcedd.xn--d1aqf.xn--p1ai/wp-content/uploads/2019/03/GettyImages-870761572.jpg',
  url: 'https://спроси.дом.рф'
};

document.addEventListener('DOMContentLoaded', () => {
  init();
  if (location.search) {
    const url = new URLSearchParams(location.search);
    window.USERID = url.get('uid');
  }
  if (window.location.hash) {
    let hash = window.location.hash;
    if (hash[0] === '#') {
      hash = hash.split('');
      hash[0] = '?';
      hash = hash.join('');
      console.log(hash);
    }
    const urlParams = new URLSearchParams(hash);
    if (urlParams.get('state')) {
      const state = JSON.parse(urlParams.get('state'));
      if (state && state.action === 'shareToOk') {
        if (!window.USERID) {
          window.location = location.origin + location.pathname + '?uid=' + state.uid + location.hash
        } else {
          const share = new Share(SHARE_DATA.url, SHARE_DATA.title, SHARE_DATA.img,
              SHARE_DATA.text);
          share['okAuthed']();
        }
      }

    } else {
      const VKToken = urlParams.get('access_token');
      if (VKToken) {
        const share = new Share(SHARE_DATA.url, SHARE_DATA.title,
            SHARE_DATA.img, SHARE_DATA.text, VKToken);
        share['vkPOST']();
      }
    }
  }
});

let button = document.getElementById('button');

button.onclick = function() {
  let text = SHARE_DATA.text;
  copyTextToClipboard(text);
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
      //console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
  }
  navigator.clipboard.writeText(text).then(
      function() {
          //console.log("Async: Copying to clipboard was successful!");
      },
      function(err) {
          console.error("Async: Could not copy text: ", err);
      }
  );
}

function init () {
  const buttons = document.querySelectorAll('.js-share-button');
  buttons.forEach(item => {
    item.addEventListener('click', buttonClicked);
  });

  document.querySelector('.js-facebook-logout').
      addEventListener('click', () => {
        FB.logout();
        document.querySelector('.fb-bar').classList.remove('fb-bar_active');
        location.reload();
      });

  function buttonClicked (e) {
    const shareType = e.target.getAttribute('data-share-type');
    const share = new Share(SHARE_DATA.url, SHARE_DATA.title, SHARE_DATA.img,
        SHARE_DATA.text);
    buttonClickedCallback(shareType);
    share[shareType]();
  }
  
}

function buttonClickedCallback (e) {
  fetch('events.php', {
    method: 'post',
    body: JSON.stringify({
      event: e,
      uid: window.USERID
    })
  })
  console.log('button clicked callback');
}

const facebook = {
  fbInited: false,
  fbUserId: -1,
  init: () => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: 1255939541450273,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v8.0'
      });
      facebook.post(SHARE_DATA.text);
      // FB.AppEvents.logPageView();
    };
    if (!facebook.fbInited) {
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  },
  post: (text) => {
    FB.ui({
      method: 'feed',
      // href: 'https://cloud.mail.ru/public/28hL/4UXiZZkES/',
      // link: 'https://cloud.mail.ru/public/28hL/4UXiZZkES/',
      // media: ['https://thumb.cloud.mail.ru/weblink/thumb/xw1/28hL/4UXiZZkES/%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3_iStock-177363748.jpg?x-email=undefined'],
      picture: 'https://xn--h1alcedd.xn--d1aqf.xn--p1ai/wp-content/uploads/promo/1200x1200_02.png',
      display: 'popup',
      quote: text,
      hashtag: '#домрф450'
    });
  }
};

const OK = {
  init: () => {
    import(/* webpackChunkName: "oksdk" */ './oksdk').then((module) => {
      window.OKSDK = module.default;
      let userUid;
      const OKSDKConfig = {
        app_id: '512000487922',
        app_key: 'CDPCHMJGDIHBABABA',

        oauth: {
          url: location.origin + location.pathname,
          state: encodeURIComponent(JSON.stringify({
            action: 'shareToOk',
            uid: window.USERID
          })),
          scope: 'VALUABLE_ACCESS,PHOTO_CONTENT'
        }
      };
      OKSDK.init(OKSDKConfig, () => {
        OK.uploadImage();
      }, (e) => {
        console.error(e);
        console.log('ok is NOOT inited');
      });
    });
  },
  publishText: (uploadedPhotoTokens) => {
    OKSDK.Widgets.post(null, {
      attachment: {
        media: [
          {
            type: 'text',
            text: SHARE_DATA.text
          },
          {
            type: 'photo',
            list: uploadedPhotoTokens
          }
        ]
      }
    });
  },
  uploadImage: () => {
    OKSDK.REST.call('photosV2.getUploadUrl', null,
      function (status, data, error) {
        if (status === 'ok' && data['upload_url']) {
          const uploadUrl = data['upload_url'];
          const formData = new FormData;
          fetch('images/1200x1200_01.png').
          then(response => response.blob()).
          then(blob => {
            formData.append('pic1', blob);
          }).
          then(() => {
            fetch(uploadUrl, {
              method: 'post',
              body: formData
            }).then(response => {
              if (response.ok) {
                return response.json();
              }
            }).then(json => {
              const uploadedPhotoTokens = [];
              const uploadedPhotos = json['photos'];
              for (let id in uploadedPhotos) {
                if (uploadedPhotos.hasOwnProperty(id)) {
                  const token = uploadedPhotos[id]['token'];
                  OKSDK.REST.call('photosV2.commit', {
                    photo_id: id,
                    token: token,
                    comment: SHARE_DATA.text
                  }, () => {
                    uploadedPhotoTokens.push({ 'id': token });
                    OK.publishText(uploadedPhotoTokens);
                  });
                }
              }
            });
          });
        }
      });
  }
};

window.OK = OK;

function Share(purl, ptitle, pimg, text) {
  this.purl = purl;
  this.ptitle = ptitle;
  this.pimg = pimg;
  this.text = text;
  /*
      url Ссылка на страницу, которая будет публиковаться.
      title   Заголовок публикации. Если не указан, то будет браться со страницы публикации.
      description Описание публикации. Если не указано, то будет браться со страницы публикации.
      image   Ссылка на иллюстрацию к публикации. Если не указана, то будет браться со страницы публикации.
  */

  this.vk = function () {
    var url = 'http://vk.com/share.php?';

    if (this.purl) {
      url += 'url=' + encodeURIComponent(this.purl);
    }

    if (this.ptitle) {
      url += '&title=' + encodeURIComponent(this.ptitle);
    }

    if (this.text) {
      url += '&description=' + encodeURIComponent(this.text);
    }

    if (this.pimg) {
      url += '&image=' + encodeURIComponent(this.pimg);
    }

    url += '&noparse=true';
    this.popup(url);
  };

  this.ok = function () {
    var url = 'https://connect.ok.ru/offer?';

    if (this.purl) {
      url += 'url=' + encodeURIComponent(this.purl);
    }

    if (this.ptitle) {
      url += '&title=' + encodeURIComponent(this.ptitle);
    }

    if (this.pimg) {
      url += '&imageUrl=' + encodeURIComponent(this.pimg);
    }

    this.popup(url);
  };

  this.fb = function () {
    var url = 'https://www.facebook.com/dialog/feed?';
    url += 'app_id=1255939541450273';
    url += '&display=popup';

    if (this.purl) {
      url += '&link=' + encodeURIComponent(this.purl);
    }

    if (this.text) {
      url += '&quote=' + encodeURIComponent(this.text);
    }

    if (this.pimg) {// url += '&media='+ encodeURIComponent('[') + this.pimg + encodeURIComponent(']');
    }

    this.popup(url);
  };

  this.popup = function (url) {
    window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
  };
}