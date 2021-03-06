/* set default values */
var imagecropping = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    i18n_message_ids: {
        confirm_discard_changes: "Your changes will be lost. Continue?"
    }
};

if (jQuery) {

    (function($) {
        imagecropping.clearCoords = function() {
            $('#coords input[hidden]').val('');
            $('#h').css({color:'red'});
            window.setTimeout(function(){
                $('#h').css({color:'inherit'});
            },500);
        };

        imagecropping.saveCoords = function() {
            this.x1 = $("#x1").val();
            this.y1 = $("#y1").val();
            this.x2 = $("#x2").val();
            this.y2 = $("#y2").val();
        };

        imagecropping.doChange = function(c) {
            // show coords
            $('#x1').val(c.x);
            $('#y1').val(c.y);
            $('#x2').val(c.x2);
            $('#y2').val(c.y2);

            // render thumbnail
            /*
            rx = c.w / 100;
            ry = c.h / 100;
            prev_node = $('#preview-' + $("#scalename").val());
            cropbox_img = $('img.cropbox');
            thumb_img = $('<img />');
            thumb_img.attr('src', cropbox_img.attr('src'));
            prev_node.html(thumb_img);
            $("img", prev_node).css({
                width: Math.round(rx * cropbox_img.attr('width')) + 'px',
                height: Math.round(ry * cropbox_img.attr('height')) + 'px',
                marginLeft: '-' + Math.round(rx * c.x) + 'px',
                marginTop: '-' + Math.round(ry * c.y) + 'px'
            });
            */
        };

        imagecropping.unsaved_changes = function() {
            /* actual coords */
            if(this.x1 != $("#x1").val() || this.y1 != $("#y1").val() ||
               this.x2 != $("#x2").val() || this.y2 != $("#y2").val()) {
                return !confirm(this.i18n_message_ids.confirm_discard_changes);
            }
            return false;
        };

        imagecropping.option_change = function(option) {
            var config = jQuery.parseJSON(option.attr('data-jcrop_config')),
                scale_name = option.attr('data-scale_name'),
                jcrop_config = {
                    onChange: imagecropping.doChange,
                    onSelect: imagecropping.doChange,
                    onRelease: imagecropping.clearCoords
                };
            jQuery.extend(jcrop_config, config);
            $('#coords img.cropbox').attr('src', config["data-imageURL"]);
            $('#coords img.cropbox').width(config["origWidth"]);
            $('#coords img.cropbox').height(config["origHeight"]);
            $('#scalename').val(scale_name);

            var jcrop_api = $('#coords img.cropbox').data('Jcrop');
            if (jcrop_api != undefined) {
                jcrop_api.destroy();
            }

            $('#coords img.cropbox').Jcrop(jcrop_config);

            option.addClass('selected').siblings().removeClass('selected');
        }

        imagecropping.init_editor = function() {
            var scales = $('ul.scales li'),
                selected = $('ul.scales li.selected');

            if(scales.length) {
                scales.click(function(e) {
                    if(imagecropping.unsaved_changes()) {
                        return false;
                    }
                    imagecropping.option_change($(this));
                    imagecropping.saveCoords();
                });
                imagecropping.option_change($(selected));
                scales.scrollTop($(selected).scrollTop());
            }

            /* save initial coords to track changes */
           this.saveCoords()
        }
    })(jQuery);
}
