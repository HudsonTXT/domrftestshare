const SHARE_DATA = {
    title: 'Это поле title',
    text: `Чем больше семья, тем больше радости. Если у вас больше двух детей, и ипотечный кредит в любом банке, тогда у меня для вас есть хорошие новости.

    Недавно`,
    longText: `Чем больше семья, тем больше радости. Если у вас больше двух детей, и ипотечный кредит в любом банке, тогда у меня для вас есть хорошие новости.

Недавно мы получили выплату по госпрограмме на погашение нашего ипотечного кредита. И вы тоже сможете получить до 450 тысяч рублей, если ваш третий или четвёртый (а может быть пятый или больше) ребёнок родился после 1 января 2019. Если ещё не родился, у вас есть время - программа действует до 31 декабря 2022 года. Возраст старших детей значения не имеет - им может быть больше 18 лет.

Условия: 
Все дети и родитель, подающий заявление, должны быть гражданами РФ.
Заявитель должен являться заёмщиком по ипотеке.
Можно получать компенсацию на договоры, заключенные до 1 июля 2023 года.
3й или последующий ребенок родились после 1 января 2019 года.

Если всё совпадает, то подавайте заявку в банк, где оформлена ипотека и получайте от государства до 450 тысяч рублей на погашение ипотеки.

Что потребуется.
заявление по форме банка;
удостоверение личности, нотариально заверенные свидетельства о рождении детей;
кредитный договор;
договор купли-продажи жилого помещения или земельного участка, или договор участия в долевом строительстве.

Заявления принимают банки, которые выдали вам ипотеку. Они же проверяют документы, а затем направляют их в ДОМ.РФ. Если возникнут вопросы, всегда можно обратиться на горячую линию ДОМ.РФ: 8 800 775-11-22 - они помогут.

Желаю удачи!

#domrf, #domrf450, #домрф, #450тысяч, #гасимипотеку, #гасимипотеку450 
    `,
    //imgUrl: window.location + 'images/share-cover.jpg'
    img: 'https://xn--h1alcedd.xn--d1aqf.xn--p1ai/wp-content/uploads/2019/03/GettyImages-870761572.jpg',
    url: 'https://спроси.дом.рф',

};


document.addEventListener("DOMContentLoaded", () => {
    init();
    if (window.location.hash) {
        let hash = window.location.hash;
        if(hash[0] === '#') {
            hash = hash.split('');
            hash[0] = '?'
            hash = hash.join('')
            console.log(hash);
        }
        const urlParams = new URLSearchParams(hash)
        const VKToken = urlParams.get('access_token');
        if (VKToken) {
            const share = new Share(SHARE_DATA.url, SHARE_DATA.title, SHARE_DATA.img, SHARE_DATA.longText, VKToken);
            share['vkPOST']();
        }
    }
})

function init () {
    const buttons = document.querySelectorAll('.js-share-button');
    buttons.forEach(item => {
        item.addEventListener('click', buttonClicked)
    })

    document.querySelector('.js-facebook-logout').addEventListener('click', () => {
        FB.logout();
        document.querySelector('.fb-bar').classList.remove('fb-bar_active');
        location.reload();
    })

    function buttonClicked (e) {
        const { shareType } = e.target.dataset;
        const share = new Share(SHARE_DATA.url, SHARE_DATA.title, SHARE_DATA.img, SHARE_DATA.longText);
        share[shareType]();
    }
    facebook.init();
}

const facebook = {
    fbInited: false,
    fbUserId: -1,
    init: () => {
        window.fbAsyncInit = function() {
            FB.init({
              appId            : 1255939541450273,
              autoLogAppEvents : true,
              xfbml            : true,
              version          : 'v8.0'
            });
            facebook.getLoginStatus();
            // FB.AppEvents.logPageView();   
          };
        if (!facebook.fbInited) {
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));
        }
    },
    login: () => {
        FB.login(function(response) {
            console.log(response)
            if (response.status === 'connected') {
                facebook.checkMe();
            } else {
              // The person is not logged into your webpage or we are unable to tell. 
            }
          }, {scope: 'user_posts'});
    },
    getLoginStatus: () => {
        FB.getLoginStatus(function(response) {
            console.log(response);
            if (response.status === 'connected') {
              // The user is logged in and has authenticated your
              // app, and response.authResponse supplies
              // the user's ID, a valid access token, a signed
              // request, and the time the access token 
              // and signed request each expire.
              var uid = response.authResponse.userID;
              var accessToken = response.authResponse.accessToken;
            } else if (response.status === 'not_authorized') {
              // The user hasn't authorized your application.  They
              // must click the Login button, or you must call FB.login
              // in response to a user gesture, to launch a login dialog.
            } else {
              // The user isn't logged in to Facebook. You can launch a
              // login dialog with a user gesture, but the user may have
              // to log in to Facebook before authorizing your application.
            }
           }, true);
    },
    checkMe: () => {
        FB.api('/me/', (r) => {
            if(r && !r.error) {
                facebook.fbUserId = r.id
                facebook.showLoginnedBar(r);
            }
        })
    },
    showLoginnedBar: (r) => {
        const fbBar = document.querySelector('.fb-bar');

        fbBar.querySelector('.fb-bar__user-img').src = `https://graph.facebook.com/${r.id}/picture?type=square`;
        fbBar.querySelector('.fb-bar__user-name').innerText = r.name

        fbBar.classList.add('fb-bar_active');
        facebook.post(SHARE_DATA.longText)
    },
    post: (text) => {
        // FB.api('/me/feed', 'post', { message: text }, function(response) {
        //     if (!response || response.error) {
        //       alert('Error occured');
        //       console.error(response.error.message)
        //     } else {
        //       alert('Post ID: ' + response.id);
        //     }
        //   });
        FB.ui({
            method: 'share',
            href: 'https://спроси.дом.рф',
            display: 'popup',
            quote: text
        })
    }
}

function Share(purl, ptitle, pimg, text, token) {
    this.purl = purl;
    this.ptitle = ptitle;
    this.pimg = pimg;
    this.text = text;
    if (token) {
        this.token = token;
    }

    /*
        url Ссылка на страницу, которая будет публиковаться.
        title   Заголовок публикации. Если не указан, то будет браться со страницы публикации.
        description Описание публикации. Если не указано, то будет браться со страницы публикации.
        image   Ссылка на иллюстрацию к публикации. Если не указана, то будет браться со страницы публикации.
    */
    this.vkOLD = function () {
        var url  = 'http://vk.com/share.php?';
        if (this.purl) {
            url += 'url=' + this.purl;
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

    this.vkGETTOKEN = function () {
        var url  = 'https://oauth.vk.com/authorize?client_id=7634875&scope=wall&display=page&v=5.124&response_type=token&redirect_uri=' + window.location;
        window.location = url;
    };

    this.vkPOST = async function () {
        const self = this;
        const body = {
            message: self.text,
            access_token: self.token,
            v: '5.124'
        };
        // const r = await fetch(`https://api.vk.com/method/wall.post?message=test&access_token=${self.token}&v=5.124`, {
        //     mode: 'no-cors',
        //     headers: {
        //         "Content-Type": "application/json",
        //         'Access-Control-Allow-Origin': '*',
        //         'Access-Control-Allow-Headers': 'Content-Type',
        //         'Access-Control-Allow-Methods': 'POST'
        //  },
        //     method: 'POST',
        //     body: JSON.stringify(body)
        // }).then(r => {
        //     console.log(r)
        // }).catch(e => {
        //     console.error(e)
        // })
    }

    this.ok = function () {
        let MD5, Base64, UTF8;
        const initMD5 = import('crypto-js/md5');
        const initBase64 = import('crypto-js/enc-base64');
        const initUTF8 = import('crypto-js/enc-utf8');
        Promise.all([initMD5, initBase64, initUTF8]).then((values) => {
            console.log(values);
            MD5 = values[0].default;
            Base64 = values[1].default;
            UTF8 = values[2].default;
            modulesInited();
        })

        const modulesInited = () => {
            const self = this;
            const clientId = '512000487922';
            const secret = '67F16EC1D0CCB6257DDA3118';
            const return_url = window.location;
            let url = 'https://connect.ok.ru/dk?st.cmd=WidgetMediatopicPost';
            const attachment = {
                media: [
                  {
                    type: "text",
                    text: self.text
                  }
                ]
            }
            let attachmentJSON = JSON.stringify(attachment);
            attachmentJSON = UTF8.parse(attachmentJSON);
            if (clientId) {
                url += '&st.app=' + clientId
            }
            if (attachment) {
                url+= '&st.attachment=' + encodeURIComponent(Base64.stringify(attachmentJSON))
            }
    
            let sigSource = '';
            sigSource += 'st.attachment=' +  Base64.stringify(attachmentJSON);
            sigSource += secret;
            url += '&st.signature=' + MD5(sigSource).toString();
            this.popup(url);
        }

        
    };

    this.fb = function () {
        const self = this;
        facebook.login();
    }

    this.fbOLD = function () {
        var url  = 'https://www.facebook.com/dialog/feed?';
        url += 'app_id=1255939541450273';
        url+= '&display=popup';

        if (this.purl) {
            url += '&link=' + encodeURIComponent(this.purl);
        }
        if (this.text) {
            url += '&quote=' + encodeURIComponent(this.text);
        }
        if (this.pimg) {
            // url += '&media='+ encodeURIComponent('[') + this.pimg + encodeURIComponent(']');
        }
        this.popup(url);
    };

    this.vk = function () {
        const self = this;
        let vkAuthed = false;
        let vkPosted = false;
        let vkApiInited = false;
        let VKToken;

        window.vkAsyncInit = function() {
            VK.init({
              apiId: 7629067
            });
            vkInited();
            // VK.Observer.subscribe('auth.login', vkPost)
          };
          
          if(!vkApiInited) {
            setTimeout(function() {
                var el = document.createElement("script");
                el.type = "text/javascript";
                el.src = "https://vk.com/js/api/openapi.js?168";
                el.async = true;
                document.getElementById("vk_api_transport").appendChild(el);
              }, 0);
          }
          
        
          const vkInited = function () {
            if(window.VK) {
                vkApiInited = true;
            }
            if (vkApiInited && !vkAuthed) {
                vkAuth();
            }
            if (vkApiInited && vkAuthed) {
                vkPost();
            }
          }

          const vkAuth= function () {
              if(!vkAuthed) {
                VK.Auth.login((callback) => {
                    console.log(callback);
                    if(callback.status === "connected") {
                        vkAuthed = true;
                        VKToken = callback.session.sid;
                        vkPost();
                    } else {
                        vkAuthed = false;
                    }
                }, 8192)
              }
          }

          const vkPost = function () {
              if (vkAuthed && !vkPosted) {
                  console.log(self.text);
                  VK.Api.call('wall.post', {
                        message: self.text.substring(0, 350) + '...',  
                        v: '5.124'
                     }, (response) => {
                      console.log(response);
                      if (response.error) {
                        vkPosted = false;
                      } else {
                          vkPosted = true;
                      }
                  })
              }
          }

    }

    this.popup = function (url) {
        window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
    };
}