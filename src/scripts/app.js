document.addEventListener("DOMContentLoaded", () => {
    init();
})

function init () {
    const buttons = document.querySelectorAll('.js-share-button');
    buttons.forEach(item => {
        item.addEventListener('click', buttonClicked)
    })

    const SHARE_DATA = {
        title: 'Скидка на ипотеку!',
        text: `
        Чем больше семья, тем больше радости. Если у вас больше двух детей, и ипотечный кредит в любом банке, тогда у меня для вас есть хорошие новости.
    
        Недавно мы получили выплату по госпрограмме на погашение нашего ипотечного кредита.         И вы тоже сможете получить до 450 тысяч рублей, если ваш третий или четвёртый (а может быть пятый или больше) ребёнок родился после 1 января 2019. Если ещё не родился, у вас есть время — программа действует до 31 декабря 2022 года. Возраст старших детей значения не имеет — им может быть больше 18 лет.
        
        Условия: 
        `,
        //imgUrl: window.location + 'images/share-cover.jpg'
        img: 'https://xn--h1alcedd.xn--d1aqf.xn--p1ai/wp-content/uploads/2019/03/GettyImages-870761572.jpg',
        url: 'https://спроси.дом.рф',
    
    };

    function buttonClicked (e) {
        const { shareType } = e.target.dataset;
        const share = new Share(SHARE_DATA.url, SHARE_DATA.title, SHARE_DATA.img, SHARE_DATA.text);
        share[shareType]();
    }
}

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
        var url  = 'http://vk.com/share.php?';
        if (this.purl) {
            url += 'url=' + encodeURIComponent(this.purl);
        }
        if (this.ptitle) {
            url += '&title=' + encodeURIComponent(this.ptitle);
        }
        if (this.pimg) {
            url += '&image=' + encodeURIComponent(this.pimg);
        }
        url += '&noparse=true';
        this.popup(url);
    };

    this.ok = function () {
        var url  = 'https://connect.ok.ru/offer?';
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

    this.popup = function (url) {
        window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
    };
}