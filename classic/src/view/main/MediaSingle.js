/**
 * Slider which supports vertical or horizontal orientation, keyboard adjustments, configurable snapping, axis clicking
 * and animation. Can be added as an item to any container.
 *
 *     @example
 *     Ext.create('Ext.slider.Single', {
 *         width: 200,
 *         value: 50,
 *         increment: 10,
 *         minValue: 0,
 *         maxValue: 100,
 *         renderTo: Ext.getBody()
 *     });
 *
 * The class Ext.slider.Single is aliased to Ext.Slider for backwards compatibility.
 */
Ext.define('Player.view.main.MediaSingle', {
  extend: 'Ext.slider.Multi',
  alias: ['widget.mediaslider', 'widget.mediasliderfield'],

  /**
   * @inheritdoc
   */
  defaultBindProperty: 'value',

  initComponent: function() {
    if (this.publishOnComplete) {
      this.valuePublishEvent = 'changecomplete';
    }
    this.callParent();
  },

  /**
   * @cfg {Boolean} [publishOnComplete=true]
   * This controls when the value of the slider is published to the `ViewModel`. By
   * default this is done only when the thumb is released (the change is complete). To
   * cause this to happen on every change of the thumb position, specify `false`. This
   * setting is `true` by default for improved performance on slower devices (such as
   * older browsers or tablets).
   */
  publishOnComplete: true,

  /**
   * Returns the current value of the slider
   * @return {Number} The current value of the slider
   */
  getValue: function() {
    // just returns the value of the first thumb, which should be the only one in a single slider
    return this.callParent([0]);
  },

  /**
   * Programmatically sets the value of the Slider. Ensures that the value is constrained within the minValue and
   * maxValue.
   * @param {Number} value The value to set the slider to. (This will be constrained within minValue and maxValue)
   * @param {Object/Boolean} [animate] `false` to not animate. `true` to use the default animation. This may also be an
   * animate configuration object, see {@link #cfg-animate}. If this configuration is omitted, the {@link #cfg-animate} configuration
   * will be used.
   */
  setValue: function(value, animate) {
    var args = arguments,
      len = args.length;

    // this is to maintain backwards compatibility for sliders with only one thumb. Usually you must pass the thumb
    // index to setValue, but if we only have one thumb we inject the index here first if given the multi-slider
    // signature without the required index. The index will always be 0 for a single slider
    if (len === 1 || (len <= 3 && typeof args[1] !== 'number')) {
      args = Ext.toArray(args);
      args.unshift(0);
    }

    return this._setValue.apply(this, args);
  },

  _setValue: function(index, value, animate, changeComplete) {
    var me = this,
      thumbs = me.thumbs,
      ariaDom = me.ariaEl.dom,
      thumb, len, i, values;

    if (Ext.isArray(index)) {
      values = index;
      animate = value;

      for (i = 0, len = values.length; i < len; ++i) {
        thumb = thumbs[i];
        if (thumb) {
          me.setValue(i, values[i], animate);
        }
      }
      return me;
    }

    thumb = me.thumbs[index];
    // ensures value is contstrained and snapped
    //value = me.normalizeValue(value);


    if (value !== thumb.value && me.fireEvent('beforechange', me, value, thumb.value, thumb) !== false) {
      thumb.value = me.normalizeValue(value);
      if (me.rendered) {
        if (Ext.isDefined(animate)) {
          animate = animate === false ? false : animate;
        } else {
          animate = me.animate;
        }
        thumb.move(me.calculateThumbPosition(value), animate);

        // At this moment we can only handle one thumb wrt ARIA
        if (index === 0 && ariaDom) {
          ariaDom.setAttribute('aria-valuenow', value);
        }

        me.fireEvent('change', me, value, thumb);
        me.checkDirty();

        if (changeComplete) {
          me.fireEvent('changecomplete', me, value, thumb);
        }
      }
    }
    return me;
  },

  onClickChange: function(trackPoint) {
    var me = this,
      thumb, index;

    // How far along the track *from the origin* was the click.
    // If vertical, the origin is the bottom of the slider track.

    //find the nearest thumb to the click event
    thumb = me.getNearest(trackPoint);
    if (!thumb.disabled) {
      index = thumb.index;
      me.setValue(index, Ext.util.Format.round(me.reversePixelValue(trackPoint), me.decimalPrecision), false, true);
    }
  },

  /**
   * @private
   */
  getNearest: function() {
    // Since there's only 1 thumb, it's always the nearest
    return this.thumbs[0];
  }
});