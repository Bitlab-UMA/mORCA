(function( $, window, undefined ) {
    $.widget( "mobile.listview", $.mobile.listview, {
        options: {
            childPages: true,
            page: "<div data-role='page'></div>",
            header: "<div data-role='header'><a href='#' data-rel='back'>Back</a><h1></h1></div>",
            content: "<div class='ui-content'></div>"
        },
        _create: function(){
            this._super();
            if( this.options.childPages ) {
                this._setupChildren();
            }
        },
        _setupChildren: function() {
            this._attachBindings();
            this.element.find( "ul" )
                .css( "display","none" )
                .parent()
                .addClass("ui-btn ui-btn-icon-right ui-icon-carat-r");
        },
        _attachBindings: function() {
            this._on({
                "click": "_handleSubpageClick"
            });
            this._on( "body", {
                "pagechange": function(){
                    if ( this.opening === true ) {
                        this.open = true;
                        this.opening = false;
                    } else if ( this.open === true ) {
                        this.open = false;
                    }
                }
            });
        },
        _handleSubpageClick: function( event ) {

            if( $(event.target).closest( "li" ).children( "ul" ).length == 0 ) {
                return;
            }

            this.opening = true;

            //See if we already created the subpage
            var $li = $(event.target).closest( "li" );
            var pid = $li.data("nextpageid");

            if (pid && pid.length > 0){
                this.pageID = pid;
            } else {
                this.newPage = $( this.options.page ).uniqueId();
                this.nestedList  = $( event.target ).closest( "li" ).children( "ul" )
                    .clone().attr( "data-" + $.mobile.ns + "role", "listview")
                    .attr("data-filter","true")
                    .css( "display", "block" );
                this.pageName = (
                    $( event.target.childNodes[0] ).text().replace(/^\s+|\s+$/g, '').length > 0 )?
                    $(event.target.childNodes[0]).closest( "li").children( "h2").text() : $( event.target.childNodes[1] ).text();
                this.pageID = this.newPage.attr( "id" );

                // Build new page
                this.newPage.append(
                        $( this.options.header ).find( "h1" ).text( this.pageName ).end()
                    ).append(
                        $( this.options.content )
                    ).find( "div.ui-content" ).append( this.nestedList );

                $( "body" ).append( this.newPage );
                //save subpage id as data attribute of the LI
                $li.data("nextpageid", this.pageID);
            }

            $( "body" ).pagecontainer( "change", "#" + this.pageID );
        }
    });
})( jQuery, this );