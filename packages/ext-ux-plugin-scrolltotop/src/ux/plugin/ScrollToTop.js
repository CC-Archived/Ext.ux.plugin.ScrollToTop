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
	requires: [
		'Ext.Anim'
	],
	
	config: {
		list: null,
		active: false,
		text: 'Scroll to Top',
		yThreshold: 160,
		scrollAnimation: {
			duration: 300
		},
		
		tpl: [
			'<div class="x-ux-list-scrolltotop">',
				'<span class="x-ux-list-scrolltotop-text">{text}</span>',
			'</div>'
		].join(''),
		
		hidden: true,
		showAnimation: {
			type: 'slideIn',
			direction: 'down'
		},
		hideAnimation: {
			type: 'slideOut',
			direction: 'up'
		}
	},
	
	isActive: false,
	
	initialize: function () {
		this.active = false;
		
		this.renderContent();
		this.element.on('tap', this.onTap, this);
		
		this.callParent(arguments);
	},
	
	init: function(list) {
		this.setList(list);
		this.initScrollable();
	},
	
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
	
	renderContent: function () {
		this.updateData({
			text: this.getText()
		});
	},
	
	onTap: function () {
		var list = this.getList();
		var scrollable = list.getScrollable();
		if (scrollable) {
			var scroller = scrollable.getScroller();
			scroller.scrollTo(0, 0, this.getScrollAnimation());
		}
	},
	
	onListScrollableChange: function(container, value, oldValue, eOpts) {
		this.initScrollable();
	},
	
	onListScroll: function (scroller, x, y, eOpts) {
		this.setActive(y >= this.getYThreshold());
	}
});