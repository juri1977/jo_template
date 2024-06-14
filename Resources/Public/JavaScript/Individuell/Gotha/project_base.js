$(() => {
	var mobile = $('#mobile-hidden').is(':hidden');
    var ajaxloader = $('#joAjaxloader');

	var headerimg = $('.header_fullscreen .header_img');
	var hc = $('.hc');
	if (headerimg.length && !mobile) {
		$(document).scroll(function() {
			headerimg.css({
	            transform: 'translate3d(0px, ' + ($(this).scrollTop() / 5) + 'px, 0px)',
	        });
	        if (hc.length) {
	        	hc.css({
		            transform: 'translate3d(0px, ' + ($(this).scrollTop() / 2) + 'px, 0px)',
		        });
	        }
		});
	}

    $('.search_wrap').on('click', '.searchcontrols a.active.show', function() {
        var that = $(this);
        setTimeout(function(){
            that.removeClass('active show');
            var id = that.attr('href').substring(1);
            $(document.getElementById(id)).removeClass('active show');
        }, 100);
    });

    $('.search_wrap .searchcontrols a').click(() => {
        setTimeout(() => {
            var tab_active = $('.tab-pane.active.show');
            if (tab_active.length) {
                var container = tab_active.find('.f-g-item');
                if (container.length) {
                    var height = container.height();
                    $('.f-g-con').css('height', height + 'px');
                    $('.f-g-con').css('maxHeight', height + 'px');
                }
            }
        }, 100);
    });

    $('.search_wrap').on('click', '.f-g-con .load_more .f_item', function(e) {
    	e.preventDefault();
    	var $that = $(this);
    	var href = $that.attr('href');
        var container = $(this).parent().parent();
        if (container.next().length) {
            var height = container.next().height();
            container.animate({top: '-=' + container.height() + 'px'}, 'slow');
            $('.f-g-con').css('height', height + 'px');
            $('.f-g-con').css('maxHeight', height + 'px');

            if (container.next().find('.load_more').length == 1) {
                container.next().animate({top: '-=' + height + 'px'}, 'slow');
            } else {
                container.next().animate({top: '-=' + container.height() + 'px'}, 'slow');
            }
            $('body,html').animate({
                scrollTop: $('.search_wrap').offset().top
            }, 500);
        } else {
            ajaxloader.show();
            var href = $(this).attr('href');

            if (href) {
                $.post(href, (data, suc) => {
                    if (suc == 'success') {
                        ajaxloader.hide();
                        var item = $(data).find('.f-g-item');
                        item.hide();
                        container.after(item);
                        var height = container.next().height();

                        container.next().css('top', height + 'px');
                        $('.f-g-con').css('height', height + 'px');
                        $('.f-g-con').css('maxHeight', height + 'px');
                        item.show();

                        container.animate({top: '-=' + container.height() + 'px'}, 'slow');
                        container.next().animate({top: '-=' + height + 'px'}, 'slow');

                        $('body,html').animate({
                            scrollTop: $('.search_wrap').offset().top
                        }, 500);
                    }
                }).fail(errorFunc);
            } else {
                errorFunc();
            }
        }
    });

    $('.search_wrap').on('click', '.joAjaxLoadPrev', function(e) {
        e.preventDefault();
        var container = $(this).parent().parent();
        var height = container.prev().height();
        //container.animate({top: '+=' + container.height() + 'px'}, 'slow');
        // container.animate({top: '+=' + height + 'px'}, 'slow');
        if (container.find('.load_more .f_item').length == 1) {
            container.animate({top: '+=' + container.height() + 'px'}, 'slow');
        } else {
            container.animate({top: '+=' + height + 'px'}, 'slow');
        }

        $('.f-g-con').css('height', height + 'px');
        $('.f-g-con').css('maxHeight', height + 'px');
        container.prev().animate({top: '+=' + height + 'px'}, 'slow');
    });

    /*
    $('.bigimg_wrap .img_item a').click(function(e) {
        e.preventDefault();
    });
    */

    /* Bild per Klick vergrößern / verkleinern */
    $('.bigimg_wrap .img_item a').click(function(e) {
    	e.preventDefault();
        if (mobile) return false;
        var $that = $(this).parent();
        var $gp = $that.parent();
        var children_count = $gp.children().length;
        var is_activ = $that.hasClass('zoomable');
        if (is_activ) {
            if (children_count > 1) $that.removeClass('col-md-10').addClass('col-md');
        	$that.removeClass('zoomable');
        	$('.img_zoom_in').fadeOut();
        	$('.img_zoom_out').fadeOut();

        	$that.parent().removeClass('active');
        } else {
            if (children_count > 1) $that.addClass('col-md-10').removeClass('col-md');
        	$that.addClass('zoomable');
        	$('.img_zoom_in').fadeIn();
        	$('.img_zoom_out').fadeIn();

        	$that.parent().addClass('active');
        }

        var $img = $that.find('img');
        $img.css('height', '100%').css('width', '100%').css('left', '0').css('top', '0').data('scr_pos', 0);

        if ($img.data('ui-draggable')) {
            if (is_activ) $img.draggable('disable');
            else $img.draggable('enable');
        }
        else if (!is_activ) $img.draggable();

        $that.parent().children().not($that).removeClass('col-md-10 active').addClass('col-md').find('img').css('height', '100%').css('width', '100%').css('left', '0').css('top', '0').data('scr_pos', 0).promise().done(function(e) {
            if($(this).data('ui-draggable')) $(this).draggable('disable');
        });

    });

    var zoom = 0;
    function zoomImg($container, delta, e) {
    	var $img = $container.find('img');
        var deep = $img.data('scr_pos');

        if (typeof deep == 'undefined' || deep < 1 || deep > 11) deep = 1;

        var width = $img.width();
        var height = $img.height();

        if (delta > 1) {
            if (deep < 11) {
                if (deep > 6 && typeof $img.data('img_reloaded') == 'undefined') {
                    ajaxloader.show();
                    var src = $img.attr('src');
                    src = src.replace('full/500,/0', 'full/3000,/0');
                    $img.load(() => {
                        ajaxloader.hide();
                    }).error(() => {
                        ajaxloader.hide();
                    }).attr('src', src);
                    $img.data('img_reloaded', 'finished');
                }
                var calcwidth = width + (width * 0.1);
                var calcheight = height + (height * 0.1);
                
                $img.width(calcwidth);
                $img.height(calcheight);

                var parentHeight = $img.parent().height();
                var parentWidth = $img.parent().width();

                var top = (parentHeight / 2) - (calcheight / 2);
                var left = (parentWidth / 2) - (calcwidth / 2);

                $img.css('top', top);
                $img.css('left', left);

                $img.data('scr_pos', deep+1);
            }
        } else {
            if (deep > 1) {
                var calcwidth = width - (width * 0.1);
                var calcheight = height - (height * 0.1);
                $img.width(calcwidth);
                $img.height(calcheight);
                var parentHeight = $img.parent().height();
                var parentWidth = $img.parent().width();
                var top = (parentHeight / 2) - (calcheight / 2);
                var left = (parentWidth / 2) - (calcwidth / 2);

                $img.css('top', top);
                $img.css('left', left);
                $img.data('scr_pos', deep-1);
            }
        }
    }

    $('.bigimg_wrap').on('wheel', '.img_big .img_item.zoomable', function(e) {
        e.preventDefault();

        var delta = e.originalEvent.deltaY;

        /*
        var delta = e.delta || e.originalEvent.wheelDelta;
        if (delta === undefined) {
          //we are on firefox
          delta = e.originalEvent.detail;
        }
        */

        zoomImg($(this), delta, e);
    });

    $('.img_zoom_in').click((e) => {
    	zoomImg($('.img_big .img_item.zoomable'), 10, e);
    });

    $('.img_zoom_out').click((e) => {
    	zoomImg($('.img_big .img_item.zoomable'), -10, e);
    });


    /*
     * josticky alternative zu css lösungen, da diese nicht überall umsetzbar sind
     * Element scrollt mit normalem scroll mit in einem definierten bereich
     *
     * @parent element, wonach sich das Top richtet
     * @gr element, welche die Höhe beschränkt, also wo das sticky drinnen bleiben/mit scrollen soll
     * @header element, header offset
     *
     */
    $.fn.josticky = function($parent, $gp, $header = []) {
        var $that = this;

        if ($parent.length && $gp.length) {
            var orig_top = $parent.offset().top;

            var header_height = 0;
            if ($header.length) header_height = $header.height();

            var el_height = $that.height();

            $(window).scroll(function(e) {
                if (mobile) return false;
                
                var gp_height = $gp.height();
                var scroll = $(this).scrollTop();

                // scroll stopp wenn man oben ist
                if ((scroll + header_height) > orig_top) {
                    var new_top = scroll;

                    // scroll stopp beim übersteigen der höhe des gp elements
                    if (new_top + el_height > gp_height) {
                        new_top = gp_height - el_height;
                        $that.css('top', new_top + 'px');
                    } else {
                        $that.css('top', new_top + 'px');
                    }

                } else {
                    $that.css('top', '');
                }
            });
        }

        return this;
    };

    // var $joToSticky = $('.joDetail .detailimage_con');
    // if ($joToSticky.length) $joToSticky.josticky($('.joDetail .detailimage'), $('.joDetail .detailimage').parent(), $('.joTop'));

    var sbar = $('#joMaps-container .joScrollWrap');
    if (sbar.length && !mobile) {
        // new SimpleBar(sbar[0]);
        sbar.niceScroll({cursorcolor:"rgba(52,102,103,0.5)",zindex:'2000'});
        //sbar.each((i, v) => new SimpleBar(v));
    }

    $('.sub_btn').click(function() {
        $(this).toggleClass('active');
        $(this).next().toggle();
    });

    $('.navbar-toggler-container').click(() => {
        $('body').toggleClass('overflow-hidden');
    });

    var working = false;
    $('.sideMenuOpener').click(function() {
        if (!working) {
            working = true;

            $(this).toggleClass('active');
            $('.sideMenu').toggleClass('active');
            
            setTimeout(function() {
                working = false;
            }, 300);
        }
    });

    var prevScrollpos = window.pageYOffset;
    $(window).scroll(function() {
        var currentScrollPos = window.pageYOffset;
        
        if (prevScrollpos > currentScrollPos) {
            $('.joFixed').css('top', '0');
        } else {
            $('.joFixed').css('top', '-' + $('.joFixed').outerHeight() + 'px');
        }

        prevScrollpos = currentScrollPos;
    });


    $('.contrast-regler').click(function(e) {
        e.preventDefault();

        var check = $(this).find('input');
        check.prop('checked', !check.prop('checked'));

        $('html').toggleClass('filter');
    });


    var $dmodal = $('#downloadModal');
    if ($dmodal.length) {
        $dmodal.appendTo('body');
    }

});
