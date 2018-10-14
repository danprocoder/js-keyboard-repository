/**
 * @author Daniel Austin
 * @email danielaustin718@gmail.com
 */


function _addEvent(element, type, func) {
    if (element.addEventListener) {
        element.addEventListener(type, func);
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, func);
    } else {
        element['on' + type] = func;
    }
}

function _getElementsByClassName(element, className) {
    var e = [],
        patt = new RegExp('(^|\\s)' + className + '($|\\s)'),
        i;
    for (i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].className && element.childNodes[i].className.match(patt)) {
            e.push(element.childNodes[i]);
        }
        if (element.childNodes[i].childNodes && element.childNodes[i].childNodes.length > 0) {
            e = e.concat(_getElementsByClassName(element.childNodes[i], className));
        }
    }
    return e;
}

window.virtualKeyboard = {
    'shiftOn': false,
    'capsOn': false,

    'init': function(themeName) {
        this.createKeyboard();
        this.setTheme(themeName);
        this.bindOutputFocusListener();
        this.bindKeysListener();
    },

    'createKeyboard': function() {
        var keyboardHTML = '<div id="vkShow" onclick="window.virtualKeyboard.show().focusOutput()" title="Show virtual keyboard.">S</div>\
            <div id="keyboard">\
                <div class="vkKeyRow">\
                    <div class="k"><span>~</span>`</div>\
                    <div class="k"><span>!</span>1</div>\
                    <div class="k"><span>@</span>2</div>\
                    <div class="k"><span>#</span>3</div>\
                    <div class="k"><span>$</span>4</div>\
                    <div class="k"><span>%</span>5</div>\
                    <div class="k"><span>^</span>6</div>\
                    <div class="k"><span>&#38;</span>7</div>\
                    <div class="k"><span>*</span>8</div>\
                    <div class="k"><span>(</span>9</div>\
                    <div class="k"><span>)</span>0</div>\
                    <div class="k"><span>_</span>-</div>\
                    <div class="k"><span>+</span>=</div>\
                    <div class="k backspace">&larr; backspace</div>\
                </div>\
                <div class="vkKeyRow">\
                    <div class="k tab">tab</div>\
                    <div class="k">Q</div>\
                    <div class="k">W</div>\
                    <div class="k">E</div>\
                    <div class="k">R</div>\
                    <div class="k">T</div>\
                    <div class="k">Y</div>\
                    <div class="k">U</div>\
                    <div class="k">I</div>\
                    <div class="k">O</div>\
                    <div class="k">P</div>\
                    <div class="k"><span>{</span>[</div>\
                    <div class="k"><span>}</span>]</div>\
                    <div class="k bslash"><span>|</span>\\</div>\
                </div>\
                <div class="vkKeyRow">\
                    <div class="k capsLock">caps lock</div>\
                    <div class="k">A</div>\
                    <div class="k">S</div>\
                    <div class="k">D</div>\
                    <div class="k">F</div>\
                    <div class="k">G</div>\
                    <div class="k">H</div>\
                    <div class="k">J</div>\
                    <div class="k">K</div>\
                    <div class="k">L</div>\
                    <div class="k"><span>:</span>;</div>\
                    <div class="k"><span>&#34;</span>&#39;</div>\
                    <div class="k enter">enter <b>&#8629;</b></div>\
                </div>\
                <div class="vkKeyRow">\
                    <div class="k shift shiftl">shift <b>&uarr;</b></div>\
                    <div class="k">Z</div>\
                    <div class="k">X</div>\
                    <div class="k">C</div>\
                    <div class="k">V</div>\
                    <div class="k">B</div>\
                    <div class="k">N</div>\
                    <div class="k">M</div>\
                    <div class="k"><span>&lt;</span>,</div>\
                    <div class="k"><span>&gt;</span>.</div>\
                    <div class="k"><span>?</span>/</div>\
                    <div class="k shift shiftr"><b>&uarr;</b> shift</div>\
                </div>\
                <div class="vkKeyRow">\
                    <div class="k hideVk" title="Hide keyboard.">h</div>\
                    <div class="k space">space</div>\
                    <div class="k hideVk" title="Hide keyboard.">h</div>\
                </div>\
            </div>';
        var container = document.createElement('div');
        container.setAttribute('id', 'keyboardWrapper');
        container.innerHTML = keyboardHTML;
        document.body.appendChild(container);

        this.keyboard = document.getElementById('keyboard');
        this.keyboard.getKeys = function() {
            return this.getKeyByClass('k');
        };
        this.keyboard.getKeyByClass = function(className) {
            var e = _getElementsByClassName(this, className);
            return e.length > 1 ? e : e[0];
        };

        _addEvent(window, 'resize', this.centerKeyboard);
    },

    /**
     * Sets the keyboard output when an element with class 'vk-output' is focused.
     */
    'bindOutputFocusListener': function() {
        var outputs = _getElementsByClassName(document.body||document.getElementsByTagName('body')[0], 'vk-output'), i;
        for (i = 0; i < outputs.length; i++) {
            _addEvent(outputs[i], 'focus', function(e) {
                e = e||window.event;
                window.virtualKeyboard.setOutput(e.target||e.srcElement);
            });

            if (outputs[i].className.match(/(^|\s)disable-keyboard(\s|$)/g)) {
                _addEvent(outputs[i], 'keydown', function(e) {
                    e = e||window.event;
                    // Only arrow keys and function keys can be used.
                    // Arrow key codes from 37 to 40, function keys codes from 112 to 123.
                    if ((e.keyCode < 37 || e.keyCode > 40) && (e.keyCode < 112 || e.keyCode > 123)) {
                        if (e.preventDefault)
                            e.preventDefault();
                        return false;
                    }
                });
            }
        }
    },

    'bindKeysListener': function() {
        var keys = this.keyboard.getKeys(), i;
        for (i = 0; i < keys.length; i++) {
            keys[i].onclick = function() {
                var key = this,
                    vk = window.virtualKeyboard,
                    caretPos = vk.getCaretPosition();
                    
                if (key.className.match(/(^|\s)hideVk($|\s)/)) {
                    window.virtualKeyboard.hide();
                } else {
                    var ch, // Keyboard character pressed.
                        a;  // regexp matches.
                    if (a = key.className.match(/(^|\s)(tab|capsLock|space|backspace|shift|enter)($|\s)/)) {
                        switch(a[2]) {
                            case 'tab':
                                ch = '\t';
                                break;
                            case 'capsLock':
                                if (vk.capsOn = !vk.capsOn) {
                                    key.className += ' on';
                                } else {
                                    key.className = key.className.replace(/(^|\s)on(?=$|\s)/g, '');
                                }
                                
                                if (caretPos != null) {
                                    vk.focusOutput(caretPos[0]);
                                }
                                vk.callKeyListeners();

                                return false;
                            case 'space':
                                ch = ' ';
                                break;
                            case 'backspace':
                                ch = '\b';
                                break;
                            case 'shift':
                                vk.toggleShift(!vk.shiftOn);

                                if (caretPos != null) {
                                    vk.focusOutput(caretPos[0]);
                                }
                                vk.callKeyListeners();

                                return false;
                            case 'enter':
                                ch = '\n';
                                break;
                        }
                    } else if (key.innerHTML.match(/^[A-Z]$/i)) {
                        if ((!vk.shiftOn && !vk.capsOn) || (vk.shiftOn && vk.capsOn)) {
                            ch = key.innerHTML.toLowerCase();
                        } else {
                            ch = key.innerHTML.toUpperCase();
                        }
                    } else {
                        ch = (vk.shiftOn ? key.firstChild.innerHTML : key.childNodes[1].data)
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>')
                                .replace(/&amp;|&#38;/g, '&');
                    }
                    vk.toggleShift(false);

                    if (vk.output) {
                        var val = vk.output.tagName.toLowerCase() == 'input' ? vk.output.value : vk.output.innerHTML;

                        if (ch == '\b') {
                            if (caretPos[0] == caretPos[1]) {
                                if (val != '' && caretPos[0] > 0) {
                                    val = val.substr(0, caretPos[0] - 1) + val.substr(caretPos[0], val.length);
                                    caretPos[0]--;
                                }
                            } else {
                                val = val.substr(0, caretPos[0]) + val.substr(caretPos[1], val.length);
                            }
                        } else {
                            val = val.substr(0, caretPos[0]) + ch + val.substr(caretPos[1], val.length);
                            caretPos[0]++;
                        }
                        
                        if (vk.output.tagName.toLowerCase() == 'input') {
                            vk.output.value = val;
                        } else {
                            vk.output.innerHTML = val;
                        }
                    }
                }

                if (caretPos != null) {
                    vk.focusOutput(caretPos[0]);
                }
                vk.callKeyListeners();

                return false;
            };
        }
    },

    'setTheme': function(themeName) {
        var themes = {'default':'vkThemeDefault','inverse':'vkThemeInverse'},
            theme = themeName in themes ? themes[themeName] : themes['default'];
        this.keyboard.className = theme,
        document.getElementById('vkShow').className = theme;
    },

    'setOutput':function(output) {
        this.output = output;
    },

    'focusOutput': function(caretPos) {
        if (this.output) {
            this.output.focus();
            
            if (this.output.setSelectionRange) {
                this.output.selectionStart = this.output.selectionEnd = caretPos;
            } else if (this.output.createTextRange) {
                var range = this.output.createTextRange();
                range.collapse(false);
                range.select();
            }
        }
    },
    
    'getCaretPosition': function() {
        if (this.output) {
            if (this.output.setSelectionRange) {
                return [this.output.selectionStart, this.output.selectionEnd];
            } else {
                var pos = this.output.tagName.toLowerCase() == 'input' ? this.output.value.length
                                                                       : this.output.innerHTML.length;
                return [pos, pos];
            }
        } else 
            return null;
    },
    
    'addKeyListener': function(fn) {
        if (!this.listeners || !(this.listeners instanceof Array)) {
            this.listeners = [];
        }
        this.listeners.push(fn);
    },

    'removeKeyListener': function(fn) {
        if (this.listeners && this.listeners instanceof Array) {
            var i;
            for (i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i] == fn) {
                    this.listeners.splice(i, 1);
                    break;
                }
            }
        }
    },

    'callKeyListeners': function() {
        if (this.listeners && this.listeners instanceof Array) {
            var i;
            for (i = 0; i < this.listeners.length; i++) {
                if (this.output)
                    this.listeners[i](this.output);
                else
                    this.listeners[i]();
            }
        }  
    },

    'toggleShift': function(b) {
        this.shiftOn = b;

        var shiftKey = this.keyboard.getKeyByClass('shift');
        if (b) {
            shiftKey[0].className += ' on',
            shiftKey[1].className += ' on';
        } else {
            shiftKey[0].className = shiftKey[0].className.replace(/(^|\s)on(?=$|\s)/g, ''),
            shiftKey[1].className = shiftKey[1].className.replace(/(^|\s)on(?=$|\s)/g, '');
        }
    },
    
    'show':function() {
        this.keyboard.style.display = 'block'; 
        document.getElementById('vkShow').style.display = 'none';
        this.centerKeyboard();
        return this;
    },

    'hide':function() {
        this.keyboard.style.display = 'none';
        document.getElementById('vkShow').style.display = 'block';
        return this;
    },

    'centerKeyboard': function() {
        var keyboard = window.virtualKeyboard.keyboard;
        if (keyboard.style.display != 'block')
            return;
        var w = window.innerWidth || document.body.clientWidth || window.documentElement.clientWidth;

        
        var capsLock = keyboard.getKeyByClass('capsLock');
        var enterKey = keyboard.getKeyByClass('enter');
        var bspaceKey = keyboard.getKeyByClass('backspace');

        capsLock.innerHTML = w <= 650 ? 'caps' : 'caps lock',
        enterKey.innerHTML = w <= 650 ? '<b>&#8629;</b>' : 'enter <b>&#8629;</b>',
        enterKey.style.textAlign = w <= 650 ? 'center' : 'left',
        bspaceKey.innerHTML = w <= 650 ? '&larr;' : '&larr; backspace',
        bspaceKey.style.textAlign = w <= 650 ? 'center' : 'left';
        
        // Center Keyboard.
        var leftPos = w < 353 ? 0 : Math.abs((w/2) - (keyboard.clientWidth/2));
        keyboard.style.left = leftPos + 'px';
    }
 };

// Load CSS file.
var css = document.createElement('link');
css.setAttribute('rel', 'stylesheet');
css.setAttribute('type', 'text/css');
css.setAttribute('href', 'http://localhost/javascript%20projects/keyboard/css/virtualkeyboard.css?a=1');
(document.head || document.getElementsByTagName('head')[0]).appendChild(css);
