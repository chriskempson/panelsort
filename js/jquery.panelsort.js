// Panel Sort jQuery Plugin
// 2011-11-02 Chris Kempson

(function($){
  
  var settings = {
    containerElement: '#items',
    columnElement: '.column',
    itemElement: '.item',
    titleElement: '.title',
    cookieName: 'panelsort',
    sortableSettings: {
      opacity: 0.8,
      forcePlaceholderSize: true,
      revert: 200,
      placeholder: 'ps-placeholder'
    }
  };

  // Two dimensional arrray for holding positions of static items
  var staticItemArray = [];
  

  $.fn.panelsort = function(options) {  

    var $this = $(this);
    $(this).show(); // Make sure the panel is visible
    var sortableArray = [];
    var columnCount = $(settings.containerElement).find(settings.columnElement).length;
    
    // Collect array of static items and store their positions
    var column = 0;
    $(settings.containerElement).find(settings.columnElement).each(function() {
      var position = 0;
      $(this).find(settings.itemElement).each(function() {
        if ($(this).hasClass('static')) {
          staticItemArray.push([column, position, $(this)]);
        } position++;
      }); column++;
    });
    
    // Update sortables
    reorderItems();

    return this.each(function() {
      
      // Merge any supplied settings
      if (options) { 
        $.extend(settings, options);
      }
      
      // For each column
      $(settings.containerElement).find(settings.columnElement).each(function() {
        
        var column = $('<ul />', {
          class: 'ps-column',
          style: 'width:' + (100 / columnCount) + '%'
        });
        
        // For each item
        $(this).find(settings.itemElement).each(function() {
          column.append($('<li />', {
            text: $(this).find(settings.titleElement).html(),
            class: 'ps-item'
          }).attr('title', $(this).attr('id')));
          
          $this.append(column);
        });
      });
      
      // Make sortable
      $('.ps-column').sortable($.extend(settings.sortableSettings, {
        connectWith: '.ps-column',
        attribute: 'title',
        key: 'title',
        update: function() {
            $('.ps-column').each(function() {
              var array = $(this).sortable('toArray', {
                attribute: 'title'
              })
              sortableArray.push(array);
            });
            
            // JSONify 
            var sortableJSON = $.toJSON(sortableArray)

            // Store values in Cookie
            $.cookie(settings.cookieName, sortableJSON);
            
            // Update sortables
            reorderItems();
            
            // Clear array
            sortableArray = [];
        }
      }));
    });
  };
  
  reorderItems = function() {
    
    var idArray = $.evalJSON($.cookie(settings.cookieName));
    var itemArray = [];
        
    // Loop round current columns and items
    $(settings.containerElement).find(settings.columnElement).each(function() {
      $(this).find(settings.itemElement).each(function() {
        itemArray[$(this).attr('id')] = $(this);
      });
    });

    // Loop round the sorted columns and items
    for (var column in idArray) {
      $(settings.columnElement+':eq('+column+')').empty();
      for (var item in idArray[column]) {
        id = idArray[column][item];
        $(settings.columnElement+':eq('+column+')').append(itemArray[id]);
      }
    }
    
    // Loop round our static items
    for (var item in staticItemArray) {
      var column = $(settings.columnElement+':eq('+staticItemArray[item][0]+')');
      var position = column.find(settings.itemElement+':eq('+staticItemArray[item][1]+')');
      
      // If the position we want doesn't exist just add it to the column
      if (position.html()) {
        position.before(staticItemArray[item][2]);
      } else {
        column.append(staticItemArray[item][2]);
      }
    }
    
    // Clear array
    items = [];
  }
  
})(jQuery);