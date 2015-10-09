var Backdrop = function () {
  this.screen = document.body.appendChild(document.createElement('main'));
  this.screen.className = "backdrop";
};

Backdrop.prototype = {
  appendChild: function (element, closes) {
    this.screen.appendChild(element);
    this.element = element;
    this.element.style.position = 'relative';
    
    if (closes) {
      // make closeable
      var button = document.createElement('button');
          button.className = 'close';
          button.innerHTML = '&times;';
          button.addEventListener('click', this.close.bind(this));
    
      this.element.insertBefore(button, this.element.firstChild);
    }
    
    return this.element;
  },
  show: function () {
    document.body.classList.add('locked');
    this.screen.classList.add('viewing');
  },
  hide: function () {
    document.body.classList.remove('locked');
    this.screen.classList.remove('viewing');
  },
  close: function (evt) {
    if (evt instanceof Event) {
      evt.preventDefault();
    }
    document.body.classList.remove('locked');
    this.screen.parentNode.removeChild(this.screen);
    this.screen = false;
    
    if (evt instanceof Function) {
      evt.call(this);
    }
  }
};