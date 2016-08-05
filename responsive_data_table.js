jQuery(document).ready(function() {
    //Helper Function to strip tags out of things.
    function stripTags(s) {return s.replace(/<\/?[^>]+>/gi, '');}

    //This is setup - add classes, add data-titles to the tds, so we can use those later
    maxWidth = 0;
    jQuery('#region-content').find('table').not('.sticky-header, .non-responsive, .sticky-enabled').each(function(index){
        if(jQuery(this).width() > maxWidth){
            maxWidth = jQuery(this).width();
        }
        //If there's no header or too complex headers, we're skiping this table
        headerRow = jQuery(this).find('thead tr');
        if (headerRow.length != 1){
            jQuery(this).addClass('non-responsive');
        }
        //TODO is there an edge case where we have fewer header cells than body cells?
        else{
            headerRowCells = headerRow.find('td, th');
            var maxSpan = 0;
            headerRowCells.each(function(){
                if(jQuery(this).attr('colspan') > maxSpan)
                    maxSpan = jQuery(this).attr('colspan');
            });
            if(maxSpan > 1)
                jQuery(this).addClass('non-responsive');       
            else {
                jQuery(this).addClass('responsive');
                jQuery(this).find('tbody tr').each(function(){
                    jQuery(this).find('td').each(function(index){
                        //If there's no text displaying, add a space. This might make pictures a little wonky.
                        if(jQuery(this).text() == "")
                            jQuery(this).html("&nbsp;");
                        if(jQuery(this).attr('colspan') > 1)
                            jQuery(this).attr('data-title','');
                        else
                            jQuery(this).attr('data-title', stripTags(headerRowCells[index].innerHTML));
                    });
                });
            }
        }
    });
    //Most of this is so that we don't need to rely on media queries, since some
    //tables are wider than others, so we can never be sure of their pixel width.
    var switched = false;
    var updateTables = function() {
        var requestedpage = window.location.pathname;
        if(requestedpage.substr(0,6) =='/admin' || requestedpage.substr(0,5) == '/imce' || requestedpage.substr(0,9) =='/taxonomy' || requestedpage.substr(0,5) =='/user' || requestedpage.substr(0,6) =='/batch')
            return true;
        if ((jQuery('#region-content').width() < maxWidth) && !switched ){
            switched = true;
            jQuery("table.responsive").each(function(i, element) {
                jQuery(element).addClass("rt");
            });
            return true;
        }
        else if (switched && (jQuery('#region-content').width() > maxWidth)) {
            switched = false;
            jQuery("table.responsive").each(function(i, element) {
                jQuery(element).removeClass("rt");
            });
        }
        if(typeof(matchHeight) == "function"){
            matchHeight();
        }
    };

    jQuery(window).load(updateTables);
    jQuery(window).bind("resize", updateTables);
});
