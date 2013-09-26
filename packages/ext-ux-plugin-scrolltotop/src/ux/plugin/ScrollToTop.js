/*
Ext.ux.plugin.ScrollToTop - "Scroll to Top" plugin for Sencha Touch's Ext.List component
http://github.com/CodeCatalyst/Ext.ux.plugin.ScrollToTop

@author John Yanarella
@version: 1.0.0

Copyright (c) 2013 CodeCatalyst, LLC - http://www.codecatalyst.com/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
Ext.define('Ext.ux.plugin.ScrollToTop', {
	extend: 'Ext.Component',
	alias: 'plugin.scrolltotop',
	
	config: {
		/**
		 * @cfg {Ext.dataview.List} list
		 * The list to which this ScrollToTop plugin is connected.
		 * This will usually be set automatically when configuring the list with this plugin.
		 * @accessor
		 */
		list: null,
		
		/**
		 * @cfg {Boolean} active Indicates whether the floating button is currently visible and active.
		 * @accessor
		 */
		active: false,
		
		/**
		 * @cfg {String} text Text for the floating button.
		 * @accessor
		 */
		text: 'Scroll to Top',
		
		/**
		 * @cfg {Number} yThreshold Vertical scrollbar threshold at which to toggle the visible and active state of the floating button.
		 * @accessor
		 */
		yThreshold: 160,
		
		/**
		 * @cfg {Object} scrollAnimation Configuration for the "scroll to top" animation.
		 */
		scrollAnimation: {
			duration: 300
		},
		
		/**
		 * @inheritdoc
		 */
		tpl: [
			'<div class="x-ux-list-scrolltotop">',
				'<div class="x-ux-list-scrolltotop-button">',
					'<span class="x-ux-list-scrolltotop-text">{text}</span>',
				'</div>',
			'</div>'
		].join(''),
		
		/**
		 * @inheritdoc
		 */
		hidden: true,
		
		/**
		 * @inheritdoc
		 */
		showAnimation: {
			type: 'slideIn',
			direction: 'down'
		},
		
		/**
		 * @inheritdoc
		 */
		hideAnimation: {
			type: 'slideOut',
			direction: 'up'
		}
	},
	
	/**
	 * @inheritdoc
	 */
	initialize: function () {
		this.active = false;
		
		this.renderContent();
		this.element.on('tap', this.onTap, this);
		
		this.callParent(arguments);
	},
	
	/**
	 * @inheritdoc
	 */
	init: function(list) {
		this.setList(list);
		this.initScrollable();
	},
	
	/**
	 * @private
	 */
	initScrollable: function() {
		var list = this.getList();
		var scrollable = list.getScrollable();
		if (scrollable) {
			list.insert(0, this);
			
			var scroller = scrollable.getScroller();
			scroller.on({
				scroll: this.onListScroll,
				scope: this
			});
		}
	},
	
	updateList: function(newList, oldList) {
		if (newList && newList != oldList) {
			newList.on({
				order: 'after',
				scrollablechange: this.onListScrollableChange,
				scope: this
			});
		} 
		else if (oldList) {
			oldList.un({
				order: 'after',
				scrollablechange: this.onListScrollableChange,
				scope: this
			});
		}
	},
	
	updateText: function(newText, oldText) {
		this.renderContent();
	},
	
	updateActive: function(newValue, oldValue) {
		if (newValue) {
			this.show();
		}
		else {
			this.hide();
		}
	},
	
	/**
	 * Render the template based on the current configuration.
	 * @private
	 */
	renderContent: function () {
		this.updateData({
			text: this.getText()
		});
	},
	
	/**
	 * Handle a 'tap' event.
	 * @private
	 */
	onTap: function () {
		var list = this.getList();
		var scrollable = list.getScrollable();
		if (scrollable) {
			var scroller = scrollable.getScroller();
			scroller.scrollTo(0, 0, this.getScrollAnimation());
		}
	},
	
	/**
	 * Handle a 'scrollablechange' event from the list.
	 * @private
	 */
	onListScrollableChange: function(container, value, oldValue, eOpts) {
		this.initScrollable();
	},
	
	/**
	 * Handle a 'scroll' event from the list.
	 * @private
	 */
	onListScroll: function (scroller, x, y, eOpts) {
		this.setActive(y >= this.getYThreshold());
	}
});