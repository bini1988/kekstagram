
'use strict';

define(['./utils', './base-component'], function(utils, BaseComponent) {

  var Picture = function(pictureData) {
    this.data = pictureData;
    this.pictureLoadTimeout = null;
    this.pictureImage = null;

    BaseComponent.call(this, this.getPictureElement());

    this.pictureImageElement = this.element.querySelector('img');
    this.pictureComments = this.element.querySelector('.picture-comments');
    this.pictureLikes = this.element.querySelector('.picture-likes');

    this.onPictureImageLoad = this.onPictureImageLoad.bind(this);
    this.onPictureImageLoadError = this.onPictureImageLoadError.bind(this);
    this.onPictureImageLoadTimeout = this.onPictureImageLoadTimeout.bind(this);
    this.onPictureClick = this.onPictureClick.bind(this);
    this.onPictureDataLikesChange = this.onPictureDataLikesChange.bind(this);
  };

  utils.inherit(Picture, BaseComponent);

  Picture.prototype.IMAGE_WIDHT = 182;
  Picture.prototype.IMAGE_HEIGHT = 182;
  Picture.prototype.IMAGE_LOAD_TIMEOUT = 5000;

  Picture.prototype.show = function(parentNode) {

    this.loadPictureImage();

    this.pictureComments.textContent = this.data.getCommentsCount();
    this.pictureLikes.textContent = this.data.getLikesCount();

    this.element.addEventListener('click', this.onPictureClick);

    this.data.onLikesChange = this.onPictureDataLikesChange;

    BaseComponent.prototype.show.call(this, parentNode);
  };

  Picture.prototype.remove = function() {

    clearTimeout(this.pictureLoadTimeout);

    this.element.removeEventListener('click', this.onPictureClick);

    this.data.onLikesChange = null;

    BaseComponent.prototype.remove.call(this);
  };

  Picture.prototype.getPictureElement = function() {

    var template = document.querySelector('#picture-template');

    var pictureToClone = (template.content)
      ? template.content.querySelector('.picture')
      : template.querySelector('.picture');

    return pictureToClone.cloneNode(true);
  };

  Picture.prototype.loadPictureImage = function() {

    this.pictureImage = new Image(this.IMAGE_WIDHT, this.IMAGE_HEIGHT);

    this.pictureImage.addEventListener('load', this.onPictureImageLoad);
    this.pictureImage.addEventListener('error', this.onPictureImageLoadError);

    this.pictureLoadTimeout = setTimeout(this.onPictureImageLoadTimeout, this.IMAGE_LOAD_TIMEOUT);

    this.pictureImage.src = this.data.getPictureUrl();
  };

  Picture.prototype.onPictureImageLoad = function(evt) {

    clearTimeout(this.pictureLoadTimeout);

    this.pictureImageElement.width = this.IMAGE_WIDHT;
    this.pictureImageElement.height = this.IMAGE_HEIGHT;

    this.pictureImageElement.src = evt.target.src;
  };

  Picture.prototype.onPictureImageLoadError = function() {
    this.element.classList.add('picture-load-failure');
  };

  Picture.prototype.onPictureImageLoadTimeout = function() {
    this.element.classList.add('picture-load-failure');
    this.pictureImage.src = '';
  };

  Picture.prototype.onPictureClick = function(evt) {

    evt.preventDefault();

    var element = evt.currentTarget;
    var parent = evt.currentTarget.parentNode;

    var index = Array.prototype.indexOf.call(parent.childNodes, element);

    location.hash = '#gallery/photos/' + index;
  };

  Picture.prototype.onPictureDataLikesChange = function(pictureData) {

    this.pictureLikes.textContent = pictureData.getLikesCount();
  };

  return Picture;
});
