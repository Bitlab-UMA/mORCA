(function( $, window, undefined ) {
    $.widget( "mobile.listview", $.mobile.listview, {
        options: {
            childPages: true,
            page: "<div data-role='page'></div>",
            header: "<div data-role='header'><a href='#' data-icon='arrow-l' data-rel='back'>Back</a><h1></h1><a href='#popupLogin' id='generatedloginButton' data-rel='popup' data-position-to='window' class='ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-check ui-btn-icon-left ui-btn-a loginButton' data-transition='pop'>Sign in</a></div>",
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
                    .attr("data-children", "")
                    .css( "display", "block" );
                this.pageName = (
                    $(event.target.childNodes[0] ).text().replace(/^\s+|\s+$/g, '').length > 0 )?
                    $(event.target.childNodes[0]).closest( "li").children( "h2").text() : $( event.target.childNodes[1] ).text();
                this.pageID = this.newPage.attr( "id" );

                // Build new page
                this.newPage.append(
                        $( this.options.header ).find( "h1" ).text( this.pageName ).end()
                    ).append(
                        $( this.options.content )
                    ).find( "div.ui-content" ).append( this.nestedList );

                if((!getCookie("username")) || (getCookie("username") == 'guest')) {

                    var popupID = "popupLogin"+this.pageID;
                    var loginpopupbuttonID = "loginpopbutton"+this.pageID;

                    this.newPage.find( "div.ui-content" ).append('<div id="'+popupID+'" data-role="popup" data-theme="a" class="ui-corner-all">' +
                    '<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete"' +
                    'data-iconpos="notext" class="ui-btn-right">Close</a>' +
                    '<h3>Sign in</h3>' +
                    '<label for="un" class="ui-hidden-accessible">Username:</label>' +
                    '<input type="text" name="user" id="un" value="guest" placeholder="Username" data-theme="a">' +
                    '<label for="pw" class="ui-hidden-accessible">Password:</label>' +
                    '<input type="password" name="pass" id="pw" value="guest" placeholder="Password" data-theme="a">' +
                    '<button id="'+loginpopupbuttonID+'" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-check">Sign in</button></div></div>');

                    this.newPage.find('#generatedloginButton').attr('href', '#'+popupID)

                    this.newPage.find("#"+loginpopupbuttonID).click(function () {
                        console.log("Login...");
                        var userform = $('#'+popupID).find('input[name="user"]').val() || "guest";
                        var passform = $('#'+popupID).find('input[name="pass"]').val() || "guest";
                        mainLogin(userform, passform);
                        $('#'+popupID).popup('close');
                    });

                } else {
                    var loginButton = this.newPage.find('.loginButton');
                        loginButton.html('logout')
                            .removeAttr('href')
                            .attr('onclick', 'mainLogout()');
                }

                $( "body" ).append( this.newPage );
                //save subpage id as data attribute of the LI
                $li.data("nextpageid", this.pageID);

            }

            $( "body" ).pagecontainer( "change", "#" + this.pageID, {transition: "slide"});

        }
    });
})( jQuery, this );