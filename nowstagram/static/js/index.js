$(function () {
    var oExports = {
        initialize: fInitialize,

        renderMore: fRenderMore,

        requestData: fRequestData,

        tpl: fTpl
    };

    oExports.initialize();

    function fInitialize() {
        var that = this;

        that.listEl = $('div.js-image-list');

        //that.uid = window.uid;
        that.page = 1;
        that.pageSize = 5;
        that.listHasNext = true;

        $('.js-load-more').on('click', function (oEvent) {
            var oEl = $(oEvent.currentTarget);
            var sAttName = 'data-load';

            if (oEl.attr(sAttName) === '1') {
                return;
            }

            oEl.attr(sAttName, '1');
            that.renderMore(function () {

                oEl.removeAttr(sAttName);

                !that.listHasNext && oEl.hide();
            });
        });
    }

    function fRenderMore(fCb) {
        var that = this;

        if (!that.listHasNext) {
            return;
        }
        that.requestData({
            uid: that.uid,
            page: that.page + 1,
            pageSize: that.pageSize,
            call: function (oResult) {

                that.listHasNext = !!oResult.has_next && (oResult.images || []).length > 0;

                that.page++;

                var sHtml = '';
                $.each(oResult.images, function (nIndex, oImage) {
                    sHtml_part1 = that.tpl([
                         '<article class="mod">',
            '<header class="mod-hd">',
                '<time class="time">#{created_date}</time>',
                '<a href="/profile/#{user_id}" class="avatar">',
                 '   <img src="#{head_url}">',
                '</a>',
                '<div class="profile-info">',
                    '<a title="#{image_user_username}" href="/profile/#{user_id}">#{image_user_username}</a>',
                '</div>',
            '</header>',
            '<div class="mod-bd">',
                '<div class="img-box">',
                    '<a href = "/image/#{id}">',
                    '<img src="#{url}">',
               ' </div>',
           ' </div>',
           ' <div class="mod-ft">',
              '  <ul class="discuss-list">',
                   ' <li class="more-discuss">',
                       ' <a>',
                           ' <span>全部 </span><span class="">#{comment_count}</span>',
                            '<span> 条评论</span></a>',
                    '</li>'].join(''), oImage);
                    sHtml_part2 = ' ';


                    for (var ni = 0; ni < oImage.comment_count; ni++){
                        dict = {'username':oImage.username[ni], 'user_id':oImage.user_id[ni],
                            'content':oImage.content[ni] };
                        sHtml_part2 += that.tpl([
                        '    <li>',
                            '    <a class="_4zhc5 _iqaka" title="#{username}" href="/profile/#{user_id}" data-reactid=".0.1.0.0.0.2.1.2:$comment-17856951190001917.1">#{username}</a>',
                            '    <span>',
                            '        <span>#{content}</span>',
                           '     </span>',
                         '   </li>',
                             ].join(''), dict);
                    }

                    sHtml_part3 =    that.tpl([
              '  </ul>',
               ' <section class="discuss-edit">',
                  '  <a class="icon-heart"></a>',
                  '  <form>',
                   '     <input placeholder="添加评论..." type="text">',
                  '  </form>',
                  '  <button class="more-info">更多选项</button>',
               ' </section>',
           ' </div>',

       ' </article>  '
                    ].join(''), oImage);
                    sHtml += sHtml_part1 + sHtml_part2 + sHtml_part3;
                });
                sHtml && that.listEl.append(sHtml);
            },
            error: function () {
                alert('出现错误，请稍后重试');
            },
            always: fCb
        });
    }

    function fRequestData(oConf) {
        var that = this;
        var sUrl = '/index/images/' + oConf.page + '/' + oConf.pageSize + '/';
        $.ajax({url: sUrl, dataType: 'json'}).done(oConf.call).fail(oConf.error).always(oConf.always);
    }

    function fTpl(sTpl, oData) {
        var that = this;
        sTpl = $.trim(sTpl);
        return sTpl.replace(/#{(.*?)}/g, function (sStr, sName) {
            return oData[sName] === undefined || oData[sName] === null ? '' : oData[sName];
        });
    }
});