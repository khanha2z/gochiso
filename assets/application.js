// Put your application javascript here
$(document).ready(function() {
    // $('.slide-teacher').slick({
    //     dots: true,
    //     arrows: false,
    //     autoplay: true,
    //     autoplaySpeed: 4000,
    //     infinite: true,
    //     speed: 1000,
    //     slidesToShow: 1,
    //     pauseOnHover: false,
    //     slidesToScroll: 1,
    //     draggable: false,
    // });
    smooth_scroll();
    _biggerlink();
    new WOW().init();
    $('.counter-count').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 3000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
    $('.slide-banner').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        fade: true,
    });

    $('.home-features-slide').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.home-features-slide-nav'
    });
    $('.home-features-slide-nav').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: '.home-features-slide',
        dots: false,
        focusOnSelect: true,
        nextArrow: '<button class="slide-arrow next-arrow"><img alt="next" src="' + window.location.origin + '/assets/images/icon-next.svg"></button>',
        prevArrow: '<button class="slide-arrow prev-arrow"><img alt="prev" src="' + window.location.origin + '/assets/images/icon-prev.svg"></button>',
        responsive: [
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
                dots: false
              }
            },
        ]
    });
    
    

    jQuery('.svg-img').each(function() {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }
            /* $svg.find('linearGradient').after('<linearGradient id="hovergradient" x1="0" y1="62" x2="124" y2="62" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffffff"></stop><stop offset="1" stop-color="#ffffff"></stop></linearGradient>'); */
            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');

    });

    $('.toggle-pc .toggle-cont').hide();
    $('.toggle-pc .toggle-hd').click(function() {
        $(this).toggleClass('active');
        $(this).closest(".toggle-pc").toggleClass("toggle-open");
        $(this).next('.toggle-cont').stop().slideToggle();
        if ($(this).parent().hasClass('slide-toggle')) {
            setTimeout($(this).parent().find('.slide-facility').slick('refresh'), 1000);
        }
    });

    $('.teacher-item').click(function() {
        var url = $(this).find('img').attr('src');
        var name = $(this).find('img').attr('data-name');
        var info = $(this).find('img').attr('data-info');
        var link = $(this).find('img').attr('data-link');
        // console.log(name);
        // console.log(url);
        if(url && name && info){
            $('.img-teacher img').animate({
                opacity: 0
              }, 300, function(){
                 $(this).attr('src', url);
            });
            $('.img-teacher img').animate({
               opacity: 1
            }, 300);
        
            // $('.img-teacher img').attr("src", url);
            $('.box-text-teacher h2 span').text(name);
            $('.teacher-info').text(info);
            $('.link-teacher').attr("href", link);
        }
    })

    var width = $(window).width();
    if (width < 767) {
        $('.product-best').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            infinite: true,
            nextArrow: '<button class="slide-arrow next-arrow">></button>',
            prevArrow: '<button class="slide-arrow prev-arrow"><</button>',
        });
    }
    var btn = $("#go-top");
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            btn.addClass("show");

            $(".footer-stick").addClass("show");
        } else {
            btn.removeClass("show");
            $(".footer-stick").removeClass("show");
        }
    });
    $('a.menu-btn').click(function() {
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $('body').removeClass('menu-open');
            $('.menu-wrapper').removeClass('open');
            $('.menu-pc-cont').removeClass('open');
            window.onscroll = function() {};
            enableScroll();
        } else {
            $(this).addClass('open')
            $('body').addClass('menu-open');
            $('.menu-wrapper').addClass('open');
            $('.menu-pc-cont').addClass('open');
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            disableScroll();
                // if any scroll is attempted, set this to the previous value
                window.onscroll = function() {
                    window.scrollTo(scrollLeft, scrollTop);
                };
        }
    });
    var keys = {
        37: 1,
        38: 1,
        39: 1,
        40: 1
    };

    function preventDefault(e) {
        e.preventDefault();
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    // modern Chrome requires { passive: false } when adding event
    var supportsPassive = false;
    try {
        window.addEventListener(" test ", null, Object.defineProperty({}, 'passive', {
            get: function() {
                supportsPassive = true;
            }
        }));
    } catch (e) {}

    var wheelOpt = supportsPassive ? {
        passive: false
    } : false;
    var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    // call this to Disable
    function disableScroll() {
        window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
        window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
        window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
        window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    }

    // call this to Enable
    function enableScroll() {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
        window.removeEventListener('touchmove', preventDefault, wheelOpt);
        window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    }
    if($('.swiper').length > 0 ){
        var thumb_slider = new Swiper(".product-thumbnail-slider", {
            loop: true,
            slidesPerView: 3,
            autoplay: true,
            direction: "vertical",
            spaceBetween: 10,
        });
      
        var large_slider = new Swiper(".product-large-slider", {
            loop: true,
            slidesPerView: 1,
            autoplay: true,
            effect: 'fade',
            thumbs: {
                swiper: thumb_slider,
            },
        });
    }
    // product single page
    $(document).ready(function() {
        var url = window.location.href;
        if ($('body').hasClass('home')) {
            if (url.indexOf('#') > 0) {
                $('#loading').hide();
                $('html').addClass('frompage');
                $('body').removeClass('loading-active');
                var target = url.substr(url.indexOf('#'));
               
                if (target != '#home') {
                    $(window).on('load', function() {
                        if (target == '#') {
                            var targetY = $('body').offset().top;
                        } else {
                            var targetY = $(target).offset().top - 50;
                        }
                        var parent = $('html');
                        setTimeout(function() {
                            $(parent).animate({ scrollTop: targetY },
                                400
                            );
    
                        }, 200);
                    });
                }
    
            } else {
                setTimeout(function() {
                    $('#loading').fadeOut(500);
                    $('body').removeClass('loading-active');
                }, 2500);
                setTimeout(function() {
                    $('.banner-home-text').addClass('is-animated');
                    // $('.slide-item-1').addClass('add-animation');
                    $('.lide-item-5 .slide-content img').addClass('is-animated');
                   
                }, 3000); 
                setTimeout(function() {
                    
                }, 2600); 
            }
        } else {
            if (url.indexOf('#') > 0) {
                var target = url.substr(url.indexOf('#'));
                if (target != '#home') {
                    $(window).on('load', function() {
                        var px =150
                        var windowwidth = window.innerWidth || document.documentElement.clientWidth || 0;
                        if (windowwidth < 768) {
                            px = 0; 
                        }
                        if (target == '#') {
                            var targetY = $('body').offset().top;
                        } else {
                            var targetY = $(target).offset().top - 50;
                        }
                        var parent = $('html');
                        $(parent).animate({ scrollTop: targetY },
                            400
                        );
                    });
                }
    
            }
    
        }
    
    });
    $(function() {
        setTimeout(function() {
            $('#loading .loading-inner').fadeIn(1600);
        }, 0); //0.5秒後にロゴをフェードイン!
        setTimeout(function() {
            $('#loading .loading-inner').fadeOut(500);
            $('.banner-home-text').addClass('is-animated');
            $('.page-cs .page-header-top').addClass('is-animated');
            $('.slide-item-1 .slide-content img, .slide-content-2 img').addClass('is-animated');
            // $('.slide-item-1').addClass('add-animation');
           
        }, 2500); //2.5秒後にロゴ含め真っ白背景をフェードアウト！
        setTimeout(function() {
            $('.page-header-img').addClass('is-animated');
        }, 500); //0.5秒後にロゴをフェードイン!
    });
});

var _biggerlink = function() {
    //BIGGERLINK
    (function($) {
        $.fn.biggerlink = function(options) {
            var settings = { biggerclass: 'bl-bigger', hoverclass: 'bl-hover', hoverclass2: 'bl-hover2', clickableclass: 'bl-hot', otherstriggermaster: true, follow: 'auto' };
            if (options) { $.extend(settings, options); }
            $(this).filter(function() { return $('a', this).length > 0; }).addClass(settings.clickableclass).css('cursor', 'pointer').each(function(i) {
                var big = $(this).data('biggerlink', { hovered: false, focused: false, hovered2: false, focused2: false });
                var links = { all: $('a', this), big: $(this), master: $('a:first', this).data('biggerlink', { status: 'master' }).addClass(settings.biggerclass), other: $('a', this).not($('a:first', this)).data('biggerlink', { status: 'other' }) };
                $('a', this).andSelf().each(function() {
                    var newdata = $.extend($(this).data('biggerlink'), links);
                    $(this).data('biggerlink', newdata);
                });
                var thistitle = big.attr('title');
                var newtitle = big.data('biggerlink').master.attr('title');
                if (newtitle && !thistitle) { big.attr('title', newtitle); }
                big.mouseover(function(event) {
                    window.status = $(this).data('biggerlink').master.get(0).href;
                    $(this).addClass(settings.hoverclass);
                    $(this).data('biggerlink').hovered = true;
                }).mouseout(function(event) {
                    window.status = '';
                    if (!$(this).data('biggerlink').focused) { $(this).removeClass(settings.hoverclass); }
                    $(this).data('biggerlink').hovered = false;
                }).bind('click', function(event) {
                    if (!$(event.target).closest('a').length) {
                        $(this).data('biggerlink').master.trigger({ type: 'click', source: 'biggerlink' });
                        event.stopPropagation();
                    }
                });
                links.all.bind('focus', function() {
                    $(this).data('biggerlink').big.addClass(settings.hoverclass);
                    $(this).data('biggerlink').big.data('biggerlink').focused = true;
                }).bind('blur', function() {
                    if (!$(this).data('biggerlink').big.data('biggerlink').hovered) { $(this).data('biggerlink').big.removeClass(settings.hoverclass); }
                    $(this).data('biggerlink').big.data('biggerlink').focused = false;
                });
                links.master.bind('click', function(event) {
                    if (event.source == 'biggerlink') {
                        if (settings.follow === true || settings.follow == 'auto' && event.result !== false) { window.location = $(this).attr('href'); } else { event.stopPropagation(); }
                    }
                });
                if (settings.otherstriggermaster) {
                    links.other.addClass(settings.biggerclass).bind('click', function(event) {
                        $(this).data('biggerlink').master.trigger({ type: 'click', source: 'biggerlink' });
                        event.preventDefault();
                        event.stopPropagation();
                    });
                } else {
                    links.other.bind('focus', function() {
                        $(this).data('biggerlink').big.addClass(settings.hoverclass2);
                        $(this).data('biggerlink').big.data('biggerlink').focused2 = true;
                    }).bind('blur', function() {
                        if (!$(this).data('biggerlink').big.data('biggerlink').hovered2) { $(this).data('biggerlink').big.removeClass(settings.hoverclass2); }
                        $(this).data('biggerlink').big.data('biggerlink').focused2 = false;
                    }).bind('mouseover', function(event) {
                        $(this).data('biggerlink').big.addClass(settings.hoverclass2);
                        $(this).data('biggerlink').big.data('biggerlink').hovered2 = true;
                        event.stopPropagation();
                    }).bind('mouseout', function(event) {
                        if (!$(this).data('biggerlink').big.data('biggerlink').focused2) { $(this).data('biggerlink').big.removeClass(settings.hoverclass2); }
                        $(this).data('biggerlink').big.data('biggerlink').hovered2 = false;
                        event.stopPropagation();
                    });
                    if (!links.other.attr('title')) { links.other.attr('title', ''); }
                }
            });
            return this;
        };
    })(jQuery);

    $(function() {
        jQuery('.biggerlink a[target="_blank"]').click(function() {
            window.open(this.href);
            return false;
        });
        jQuery('.biggerlink').biggerlink({ otherstriggermaster: false });
    });
}
var smooth_scroll = function() {
    // SMOOTHSCROLL
    $("a[href^=\\#]:not(.popup, .tabs-link, .nav-main li a)").on('click', function(event) {
        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();
            // Store hash
            var hash = this.hash;
            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 100
            }, 400, function() {
                // Add hash (#) to URL when done scrolling (default click behavior)
                history.pushState({}, "", hash)
            });
        } // End if
    });
};


$(document).ready(function(){
var $star_rating = $('.star-rating .fa');

var SetRatingStar = function() {
  return $star_rating.each(function() {
    if (parseInt($star_rating.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
      return $(this).removeClass('rating-color');
    } else {
      return $(this).removeClass('rating-color');
    }
  });
};

$star_rating.on('click', function() {
  $star_rating.siblings('input.rating-value').val($(this).data('rating'));
  return SetRatingStar();
});

SetRatingStar();
$(document).ready(function() {

});}
)


// jQuery(document).on('click', '#adong_reg_submit', function() {
//     var email = jQuery('#email_res').val();
//     var password = jQuery('#password_res').val();
//     var noti = '0';
//     if (email == '' || password == '') {
//         jQuery('#message').html('<span class="error">完全な情報を入力してください</span>');
//         jQuery(this).html('Đăng ký')
//     } else {
//         if (IsEmail(email) == !1) {
//             jQuery('#message').html('<span class="error">Email không đúng định dạng</span>');
//             jQuery(this).html('Đăng ký')
//         } else if (password.length < 6) {
//             jQuery('#message').html('<span class="error">Mật khẩu phải từ 6 kí tự trở lên</span>');
//             jQuery(this).html('Đăng ký')
//         } else {
//             jQuery('#form-register').submit()
//         }
//     }
// })