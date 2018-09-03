import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNames: 'demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50',

  click(e) {
    if ($('#side-nav').hasClass('is-visible')) {
      $('#side-nav').removeClass('is-visible');
    }
  }
});
