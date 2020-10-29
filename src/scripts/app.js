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

let device = {};
let userAgent = window.navigator.userAgent.toLowerCase();

device.windows = function () {
  return find('windows');
};

device.ios = function () {
  return device.iphone() || device.ipod() || device.ipad();
};

device.iphone = function () {
  return !device.windows() && find('iphone');
};

device.ipod = function () {
  return find('ipod');
};

device.ipad = function () {
  return find('ipad');
};

find = function (needle) {
  return userAgent.indexOf(needle) !== -1;
};

const buttons = document.querySelectorAll("button");
buttons.forEach((item) => {
  item.addEventListener("click", (e) => {
    console.log(e);
    const share = e.target.getAttribute('data-share');
    if (share === "instagram") {
      if(device.ios()) {
        window.open("instagram://app");
      } else window.open("intent://instagram.com/_n/mainfeed/#Intent;package=com.instagram.android;scheme=https;end");
    }

    switch (share) {
      case "vk":
        window.open("vk://");
        break;
      case "ok":
        window.open("ok://");
        break;
      case "fb":
        window.open("facebook://");
        break;
    }
  });
});

const buttonCopy = document.getElementById('button');
buttonCopy.onclick = function() {
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