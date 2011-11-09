# Panelsort
A jQuery plugin for sorting elements through a dynamically generated overview panel. This plugin was written to address the issue of sortable elements with large content. Elements become difficult to sort if they have a large amount of content due to the fact that they may extend past the currently viewable portion of a website. A panel with a representation of the sortable elements resolves this issue.

## Example Usage
A simple example with a single column and three sortable items.

    <div id="ps-panel"></div>
    <div id="items">
      <div class="ps-column">
        <div id="id-1" class="ps-item">
          <p>Lorem ipsum dolor sit amet</p>
        </div>
        <div id="id-2" class="ps-item">
          <p>Lorem ipsum dolor sit amet</p>
        </div>
        <div id="id-3" class="ps-item">
          <p>Lorem ipsum dolor sit amet</p>
        </div>
      </div>
    </div>
    
    <script type="text/javascript">
      $(document).ready(function() {
        $("#ps-panel").panelsort();
      });
    </script>
    
# Static Items
If you would like to make an item static, use the class `ps-static-item` instead of `ps-item`.

# Popup
This plugin works well inside a popup div. An example of doing this with [jQueryUI Dialog](http://jqueryui.com/demos/dialog/) is as follows:

      $("#ps-panel").dialog({
        create: function(event, ui) {
          $(this).panelsort({
            sortableSettings: {
            helper: 'clone',
            appendTo: 'body',
            zIndex: 1100
          });
        }
      });

# Config Options
The plugin is setup with the following defaults. Feel free to override them if you wish. Also, note that you can set your own settings for [jQueryUI Sortable](http://jqueryui.com/demos/sortable/) and [jQuery Cookie](https://github.com/carhartl/jquery-cookie) with `sortableSettings` and `cookieSettings`.

    {
      containerElement: '#ps-items',
      columnClass: 'ps-column',
      itemClass: 'ps-item',
      staticItemClass: 'ps-static-item',
      titleClass: 'ps-title',
      cookieName: 'panelsort',
      sortableSettings: {
        opacity: 0.8,
        forcePlaceholderSize: true,
        revert: 200,
        placeholder: 'ps-panel-placeholder'
      },
      cookieSettings: {
        expires: 1826 // 5 Years
      }
    }