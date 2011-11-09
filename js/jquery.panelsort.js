// Panel Sort jQuery Plugin
// 2011-11-02 Chris Kempson
// Makes use of jQueryUI Sortables and jQuery Cookie

(function($){

	var settings = {
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
	};

	// Two dimensional arrray for holding positions of static items
	var staticItemArray = [];

	$.fn.panelsort = function(options) {

		var $this = $(this);
		$(this).show(); // Make sure the panel is visible
		var sortableArray = [];
		var columnCount = $(settings.containerElement).find('.'+settings.columnClass).length;

		// Collect array of static items and store their positions
		var column = 0;
		$(settings.containerElement).find('.'+settings.columnClass).each(function() {
			var position = 0;
			$(this).find('.'+settings.itemClass+', .'+settings.staticItemClass).each(function() {
				if ($(this).hasClass(settings.staticItemClass)) {
					staticItemArray.push([column, position, $(this)]);
				};
				position++;
			});
			column++;
		});

		// Update sortables
		if ($.cookie(settings.cookieName)) reorderItems();

		return this.each(function() {

			// Merge any supplied settings
			if (options) { $.extend(true, settings, options); }

			// For each column
			$(settings.containerElement).find('.'+settings.columnClass).each(function() {

				var column = $('<ul />', {
					'class': 'ps-panel-column',
					style: 'width:' + (100 / columnCount) + '%'
				});
				$this.append(column);

				// For each item
				$(this).find('.'+settings.itemClass).each(function() {
					column.append($('<li />', {
						html: '<span class="ps-panel-icon"></span><span class="ps-panel-title">'+getItemTitle($(this))+'</span>',
						'class': 'ps-panel-item'
					}).attr('rel', $(this).attr('id')));
				});
			});

			// Make sortable
			$('.ps-panel-column').sortable($.extend(settings.sortableSettings, {
				connectWith: '.ps-panel-column',
				attribute: 'rel',
				key: 'rel',
				update: function() {
						$('.ps-panel-column').each(function() {
							var array = $(this).sortable('toArray', {
								attribute: 'rel'
							})
							sortableArray.push(array);
						});

						// JSONify
						var sortableJSON = $.toJSON(sortableArray)

						// Store values in Cookie
						$.cookie(settings.cookieName, sortableJSON, settings.cookieSettings);

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
		$(settings.containerElement).find('.'+settings.columnClass).each(function() {
			$(this).find('.'+settings.itemClass).each(function() {
				itemArray[$(this).attr('id')] = $(this);
			});
		});

		// Loop round the sorted columns and items
		for (var column in idArray) {
			$('.'+settings.columnClass+':eq('+column+')').empty();
			for (var item in idArray[column]) {
				id = idArray[column][item];
				$('.'+settings.columnClass+':eq('+column+')').append(itemArray[id]);
			}
		}

		// Loop round our static items
		for (var item in staticItemArray) {
			var column = $('.'+settings.columnClass+':eq('+staticItemArray[item][0]+')');
			var position = column.find('.'+settings.itemClass+', .'+settings.staticItemClass).eq(staticItemArray[item][1]);

			// If the position we want doesn't exist just add it to the column
			if (position.length) {
				position.before(staticItemArray[item][2]);
			} else {
				column.append(staticItemArray[item][2]);
			}
		}

		// Clear array
		items = [];
	}

	getItemTitle = function(item) {
		if (item.attr('title')) return item.attr('title');
		else if (item.find('.'+settings.titleClass).html()) return item.find('.'+settings.titleClass).html();
		else return 'Item';
	}

})(jQuery);