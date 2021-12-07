/*!
 * Copyright (c) 2012 - 2021, Anaconda, Inc., and Bokeh Contributors
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * 
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * 
 * Neither the name of Anaconda nor the names of any contributors
 * may be used to endorse or promote products derived from this software
 * without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */
(function(root, factory) {
  factory(root["Bokeh"], "2.4.1");
})(this, function(Bokeh, version) {
  let define;
  return (function(modules, entry, aliases, externals) {
    const bokeh = typeof Bokeh !== "undefined" && (version != null ? Bokeh[version] : Bokeh);
    if (bokeh != null) {
      return bokeh.register_plugin(modules, entry, aliases);
    } else {
      throw new Error("Cannot find Bokeh " + version + ". You have to load it prior to loading plugins.");
    }
  })
({
524: /* models/glyphs/webgl/main.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    require(525) /* ./index */;
},
525: /* models/glyphs/webgl/index.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var tslib_1 = require(1) /* tslib */;
    /*
    Copyright notice: many of the awesome techniques and  GLSL code contained in
    this module are based on work by Nicolas Rougier as part of the Glumpy and
    Vispy projects. The algorithms are published in
    http://jcgt.org/published/0003/04/01/ and http://jcgt.org/published/0002/02/08/
    
    Other locations where we work with GL, or prepare for GL-rendering:
    - canvas.ts
    - plot.ts
    - glyph.ts
    - glyph_renderer.ts
    */
    var regl_wrap_1 = require(526) /* ./regl_wrap */;
    __esExport("get_regl", regl_wrap_1.get_regl);
    (0, tslib_1.__exportStar)(require(536) /* ./line_gl */, exports);
    (0, tslib_1.__exportStar)(require(540) /* ./rect */, exports);
    (0, tslib_1.__exportStar)(require(541) /* ./markers */, exports);
},
526: /* models/glyphs/webgl/regl_wrap.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var tslib_1 = require(1) /* tslib */;
    var regl_1 = (0, tslib_1.__importDefault)(require(527) /* regl */);
    var dash_cache_1 = require(528) /* ./dash_cache */;
    var regl_line_vert_1 = (0, tslib_1.__importDefault)(require(530) /* ./regl_line.vert */);
    var regl_line_frag_1 = (0, tslib_1.__importDefault)(require(531) /* ./regl_line.frag */);
    var markers_vert_1 = (0, tslib_1.__importDefault)(require(532) /* ./markers.vert */);
    var markers_frag_1 = (0, tslib_1.__importDefault)(require(533) /* ./markers.frag */);
    var rect_vert_1 = (0, tslib_1.__importDefault)(require(534) /* ./rect.vert */);
    var rect_frag_1 = (0, tslib_1.__importDefault)(require(535) /* ./rect.frag */);
    // All access to regl is performed via the get_regl() function that returns a
    // ReglWrapper object.  This ensures that regl is correctly initialised before
    // it is used, and is only initialised once.
    var regl_wrapper;
    function get_regl(gl) {
        if (regl_wrapper == null)
            regl_wrapper = new ReglWrapper(gl);
        return regl_wrapper;
    }
    exports.get_regl = get_regl;
    var ReglWrapper = /** @class */ (function () {
        function ReglWrapper(gl) {
            try {
                this._regl = (0, regl_1.default)({
                    gl: gl,
                    extensions: [
                        "ANGLE_instanced_arrays",
                        "EXT_blend_minmax",
                    ],
                });
                this._regl_available = true;
                // Initialise static Buffers/Elements.
                this._line_geometry = this._regl.buffer({
                    usage: "static",
                    type: "float",
                    data: [[-2, 0], [-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1]],
                });
                this._line_triangles = this._regl.elements({
                    usage: "static",
                    primitive: "triangles",
                    data: [[0, 1, 5], [1, 2, 5], [5, 2, 4], [2, 3, 4]],
                });
            }
            catch (err) {
                this._regl_available = false;
            }
        }
        // Create and return ReGL Buffer.
        ReglWrapper.prototype.buffer = function (options) {
            return this._regl.buffer(options);
        };
        ReglWrapper.prototype.clear = function (width, height) {
            this._viewport = { x: 0, y: 0, width: width, height: height };
            this._regl.clear({ color: [0, 0, 0, 0] });
        };
        Object.defineProperty(ReglWrapper.prototype, "has_webgl", {
            get: function () {
                return this._regl_available;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ReglWrapper.prototype, "scissor", {
            get: function () {
                return this._scissor;
            },
            enumerable: false,
            configurable: true
        });
        ReglWrapper.prototype.set_scissor = function (x, y, width, height) {
            this._scissor = { x: x, y: y, width: width, height: height };
        };
        Object.defineProperty(ReglWrapper.prototype, "viewport", {
            get: function () {
                return this._viewport;
            },
            enumerable: false,
            configurable: true
        });
        ReglWrapper.prototype.dashed_line = function () {
            if (this._dashed_line == null)
                this._dashed_line = regl_dashed_line(this._regl, this._line_geometry, this._line_triangles);
            return this._dashed_line;
        };
        ReglWrapper.prototype.get_dash = function (line_dash) {
            if (this._dash_cache == null)
                this._dash_cache = new dash_cache_1.DashCache(this._regl);
            return this._dash_cache.get(line_dash);
        };
        ReglWrapper.prototype.marker = function (marker_type) {
            if (this._marker_map == null)
                this._marker_map = new Map();
            var func = this._marker_map.get(marker_type);
            if (func == null) {
                func = regl_marker(this._regl, marker_type);
                this._marker_map.set(marker_type, func);
            }
            return func;
        };
        ReglWrapper.prototype.rect_no_hatch = function () {
            if (this._rect_no_hatch == null)
                this._rect_no_hatch = regl_rect_no_hatch(this._regl);
            return this._rect_no_hatch;
        };
        ReglWrapper.prototype.rect_hatch = function () {
            if (this._rect_hatch == null)
                this._rect_hatch = regl_rect_hatch(this._regl);
            return this._rect_hatch;
        };
        ReglWrapper.prototype.solid_line = function () {
            if (this._solid_line == null)
                this._solid_line = regl_solid_line(this._regl, this._line_geometry, this._line_triangles);
            return this._solid_line;
        };
        return ReglWrapper;
    }());
    exports.ReglWrapper = ReglWrapper;
    ReglWrapper.__name__ = "ReglWrapper";
    // Regl rendering functions are here as some will be reused, e.g. lines may also
    // be used around polygons or for bezier curves.
    // Mesh for line rendering (solid and dashed).
    //
    //   1       5-----4
    //          /|\    |\
    //         / | \   | \
    // y 0    0  |  \  |  3
    //         \ |   \ | /
    //          \|    \|/
    //  -1       1-----2
    //
    //       -2  -1    1  2
    //              x
    function regl_solid_line(regl, line_geometry, line_triangles) {
        var config = {
            vert: regl_line_vert_1.default,
            frag: regl_line_frag_1.default,
            attributes: {
                a_position: {
                    buffer: line_geometry,
                    divisor: 0,
                },
                a_point_prev: function (_, props) {
                    return props.points.to_attribute_config();
                },
                a_point_start: function (_, props) {
                    return props.points.to_attribute_config(Float32Array.BYTES_PER_ELEMENT * 2);
                },
                a_point_end: function (_, props) {
                    return props.points.to_attribute_config(Float32Array.BYTES_PER_ELEMENT * 4);
                },
                a_point_next: function (_, props) {
                    return props.points.to_attribute_config(Float32Array.BYTES_PER_ELEMENT * 6);
                },
            },
            uniforms: {
                u_canvas_size: regl.prop("canvas_size"),
                u_pixel_ratio: regl.prop("pixel_ratio"),
                u_antialias: regl.prop("antialias"),
                u_line_color: regl.prop("line_color"),
                u_linewidth: regl.prop("linewidth"),
                u_miter_limit: regl.prop("miter_limit"),
                u_line_join: regl.prop("line_join"),
                u_line_cap: regl.prop("line_cap"),
            },
            elements: line_triangles,
            instances: regl.prop("nsegments"),
            blend: {
                enable: true,
                equation: "max",
                func: {
                    srcRGB: 1,
                    srcAlpha: 1,
                    dstRGB: 1,
                    dstAlpha: 1,
                },
            },
            depth: { enable: false },
            scissor: {
                enable: true,
                box: regl.prop("scissor"),
            },
            viewport: regl.prop("viewport"),
        };
        return regl(config);
    }
    function regl_dashed_line(regl, line_geometry, line_triangles) {
        var config = {
            vert: "#define DASHED\n\n" + regl_line_vert_1.default,
            frag: "#define DASHED\n\n" + regl_line_frag_1.default,
            attributes: {
                a_position: {
                    buffer: line_geometry,
                    divisor: 0,
                },
                a_point_prev: function (_, props) {
                    return props.points.to_attribute_config();
                },
                a_point_start: function (_, props) {
                    return props.points.to_attribute_config(Float32Array.BYTES_PER_ELEMENT * 2);
                },
                a_point_end: function (_, props) {
                    return props.points.to_attribute_config(Float32Array.BYTES_PER_ELEMENT * 4);
                },
                a_point_next: function (_, props) {
                    return props.points.to_attribute_config(Float32Array.BYTES_PER_ELEMENT * 6);
                },
                a_length_so_far: function (_, props) {
                    return props.length_so_far.to_attribute_config();
                },
            },
            uniforms: {
                u_canvas_size: regl.prop("canvas_size"),
                u_pixel_ratio: regl.prop("pixel_ratio"),
                u_antialias: regl.prop("antialias"),
                u_line_color: regl.prop("line_color"),
                u_linewidth: regl.prop("linewidth"),
                u_miter_limit: regl.prop("miter_limit"),
                u_line_join: regl.prop("line_join"),
                u_line_cap: regl.prop("line_cap"),
                u_dash_tex: regl.prop("dash_tex"),
                u_dash_tex_info: regl.prop("dash_tex_info"),
                u_dash_scale: regl.prop("dash_scale"),
                u_dash_offset: regl.prop("dash_offset"),
            },
            elements: line_triangles,
            instances: regl.prop("nsegments"),
            blend: {
                enable: true,
                equation: "max",
                func: {
                    srcRGB: 1,
                    srcAlpha: 1,
                    dstRGB: 1,
                    dstAlpha: 1,
                },
            },
            depth: { enable: false },
            scissor: {
                enable: true,
                box: regl.prop("scissor"),
            },
            viewport: regl.prop("viewport"),
        };
        return regl(config);
    }
    function regl_marker(regl, marker_type) {
        var config = {
            vert: markers_vert_1.default,
            frag: "#define USE_" + marker_type.toUpperCase() + "\n\n" + markers_frag_1.default,
            attributes: {
                a_position: {
                    buffer: regl.buffer([[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5]]),
                    divisor: 0,
                },
                a_center: function (_, props) {
                    return props.center.to_attribute_config();
                },
                a_size: function (_, props) {
                    return props.size.to_attribute_config();
                },
                a_angle: function (_, props) {
                    return props.angle.to_attribute_config();
                },
                a_linewidth: function (_, props) {
                    return props.linewidth.to_attribute_config();
                },
                a_line_color: function (_, props) {
                    return props.line_color.to_attribute_config();
                },
                a_fill_color: function (_, props) {
                    return props.fill_color.to_attribute_config();
                },
                a_show: function (_, props) {
                    return props.show.to_attribute_config();
                },
            },
            uniforms: {
                u_canvas_size: regl.prop("canvas_size"),
                u_pixel_ratio: regl.prop("pixel_ratio"),
                u_antialias: regl.prop("antialias"),
            },
            count: 4,
            primitive: "triangle fan",
            instances: regl.prop("nmarkers"),
            blend: {
                enable: true,
                func: {
                    srcRGB: "one",
                    srcAlpha: "one",
                    dstRGB: "one minus src alpha",
                    dstAlpha: "one minus src alpha",
                },
            },
            depth: { enable: false },
            scissor: {
                enable: true,
                box: regl.prop("scissor"),
            },
            viewport: regl.prop("viewport"),
        };
        return regl(config);
    }
    function regl_rect_no_hatch(regl) {
        var config = {
            vert: rect_vert_1.default,
            frag: rect_frag_1.default,
            attributes: {
                a_position: {
                    buffer: regl.buffer([[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5]]),
                    divisor: 0,
                },
                a_center: function (_, props) {
                    return props.center.to_attribute_config();
                },
                a_width: function (_, props) {
                    return props.width.to_attribute_config();
                },
                a_height: function (_, props) {
                    return props.height.to_attribute_config();
                },
                a_angle: function (_, props) {
                    return props.angle.to_attribute_config();
                },
                a_linewidth: function (_, props) {
                    return props.linewidth.to_attribute_config();
                },
                a_line_color: function (_, props) {
                    return props.line_color.to_attribute_config();
                },
                a_fill_color: function (_, props) {
                    return props.fill_color.to_attribute_config();
                },
                a_line_join: function (_, props) {
                    return props.line_join.to_attribute_config();
                },
                a_show: function (_, props) {
                    return props.show.to_attribute_config();
                },
            },
            uniforms: {
                u_canvas_size: regl.prop("canvas_size"),
                u_pixel_ratio: regl.prop("pixel_ratio"),
                u_antialias: regl.prop("antialias"),
            },
            count: 4,
            primitive: "triangle fan",
            instances: regl.prop("nmarkers"),
            blend: {
                enable: true,
                func: {
                    srcRGB: "one",
                    srcAlpha: "one",
                    dstRGB: "one minus src alpha",
                    dstAlpha: "one minus src alpha",
                },
            },
            depth: { enable: false },
            scissor: {
                enable: true,
                box: regl.prop("scissor"),
            },
            viewport: regl.prop("viewport"),
        };
        return regl(config);
    }
    function regl_rect_hatch(regl) {
        var config = {
            vert: "#define HATCH\n\n" + rect_vert_1.default,
            frag: "#define HATCH\n\n" + rect_frag_1.default,
            attributes: {
                a_position: {
                    buffer: regl.buffer([[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5]]),
                    divisor: 0,
                },
                a_center: function (_, props) {
                    return props.center.to_attribute_config();
                },
                a_width: function (_, props) {
                    return props.width.to_attribute_config();
                },
                a_height: function (_, props) {
                    return props.height.to_attribute_config();
                },
                a_angle: function (_, props) {
                    return props.angle.to_attribute_config();
                },
                a_linewidth: function (_, props) {
                    return props.linewidth.to_attribute_config();
                },
                a_line_color: function (_, props) {
                    return props.line_color.to_attribute_config();
                },
                a_fill_color: function (_, props) {
                    return props.fill_color.to_attribute_config();
                },
                a_line_join: function (_, props) {
                    return props.line_join.to_attribute_config();
                },
                a_show: function (_, props) {
                    return props.show.to_attribute_config();
                },
                a_hatch_pattern: function (_, props) {
                    return props.hatch_pattern.to_attribute_config();
                },
                a_hatch_scale: function (_, props) {
                    return props.hatch_scale.to_attribute_config();
                },
                a_hatch_weight: function (_, props) {
                    return props.hatch_weight.to_attribute_config();
                },
                a_hatch_color: function (_, props) {
                    return props.hatch_color.to_attribute_config();
                },
            },
            uniforms: {
                u_canvas_size: regl.prop("canvas_size"),
                u_pixel_ratio: regl.prop("pixel_ratio"),
                u_antialias: regl.prop("antialias"),
            },
            count: 4,
            primitive: "triangle fan",
            instances: regl.prop("nmarkers"),
            blend: {
                enable: true,
                func: {
                    srcRGB: "one",
                    srcAlpha: "one",
                    dstRGB: "one minus src alpha",
                    dstAlpha: "one minus src alpha",
                },
            },
            depth: { enable: false },
            scissor: {
                enable: true,
                box: regl.prop("scissor"),
            },
            viewport: regl.prop("viewport"),
        };
        return regl(config);
    }
},
527: /* regl/dist/regl.js */ function _(require, module, exports, __esModule, __esExport) {
    (function (global, factory) {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            typeof define === 'function' && define.amd ? define(factory) :
                (global.createREGL = factory());
    }(this, (function () {
        'use strict';
        var isTypedArray = function (x) {
            return (x instanceof Uint8Array ||
                x instanceof Uint16Array ||
                x instanceof Uint32Array ||
                x instanceof Int8Array ||
                x instanceof Int16Array ||
                x instanceof Int32Array ||
                x instanceof Float32Array ||
                x instanceof Float64Array ||
                x instanceof Uint8ClampedArray);
        };
        var extend = function (base, opts) {
            var keys = Object.keys(opts);
            for (var i = 0; i < keys.length; ++i) {
                base[keys[i]] = opts[keys[i]];
            }
            return base;
        };
        // Error checking and parameter validation.
        //
        // Statements for the form `check.someProcedure(...)` get removed by
        // a browserify transform for optimized/minified bundles.
        //
        /* globals atob */
        var endl = '\n';
        // only used for extracting shader names.  if atob not present, then errors
        // will be slightly crappier
        function decodeB64(str) {
            if (typeof atob !== 'undefined') {
                return atob(str);
            }
            return 'base64:' + str;
        }
        function raise(message) {
            var error = new Error('(regl) ' + message);
            console.error(error);
            throw error;
        }
        function check(pred, message) {
            if (!pred) {
                raise(message);
            }
        }
        function encolon(message) {
            if (message) {
                return ': ' + message;
            }
            return '';
        }
        function checkParameter(param, possibilities, message) {
            if (!(param in possibilities)) {
                raise('unknown parameter (' + param + ')' + encolon(message) +
                    '. possible values: ' + Object.keys(possibilities).join());
            }
        }
        function checkIsTypedArray(data, message) {
            if (!isTypedArray(data)) {
                raise('invalid parameter type' + encolon(message) +
                    '. must be a typed array');
            }
        }
        function standardTypeEh(value, type) {
            switch (type) {
                case 'number': return typeof value === 'number';
                case 'object': return typeof value === 'object';
                case 'string': return typeof value === 'string';
                case 'boolean': return typeof value === 'boolean';
                case 'function': return typeof value === 'function';
                case 'undefined': return typeof value === 'undefined';
                case 'symbol': return typeof value === 'symbol';
            }
        }
        function checkTypeOf(value, type, message) {
            if (!standardTypeEh(value, type)) {
                raise('invalid parameter type' + encolon(message) +
                    '. expected ' + type + ', got ' + (typeof value));
            }
        }
        function checkNonNegativeInt(value, message) {
            if (!((value >= 0) &&
                ((value | 0) === value))) {
                raise('invalid parameter type, (' + value + ')' + encolon(message) +
                    '. must be a nonnegative integer');
            }
        }
        function checkOneOf(value, list, message) {
            if (list.indexOf(value) < 0) {
                raise('invalid value' + encolon(message) + '. must be one of: ' + list);
            }
        }
        var constructorKeys = [
            'gl',
            'canvas',
            'container',
            'attributes',
            'pixelRatio',
            'extensions',
            'optionalExtensions',
            'profile',
            'onDone'
        ];
        function checkConstructor(obj) {
            Object.keys(obj).forEach(function (key) {
                if (constructorKeys.indexOf(key) < 0) {
                    raise('invalid regl constructor argument "' + key + '". must be one of ' + constructorKeys);
                }
            });
        }
        function leftPad(str, n) {
            str = str + '';
            while (str.length < n) {
                str = ' ' + str;
            }
            return str;
        }
        function ShaderFile() {
            this.name = 'unknown';
            this.lines = [];
            this.index = {};
            this.hasErrors = false;
        }
        function ShaderLine(number, line) {
            this.number = number;
            this.line = line;
            this.errors = [];
        }
        function ShaderError(fileNumber, lineNumber, message) {
            this.file = fileNumber;
            this.line = lineNumber;
            this.message = message;
        }
        function guessCommand() {
            var error = new Error();
            var stack = (error.stack || error).toString();
            var pat = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(stack);
            if (pat) {
                return pat[1];
            }
            var pat2 = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(stack);
            if (pat2) {
                return pat2[1];
            }
            return 'unknown';
        }
        function guessCallSite() {
            var error = new Error();
            var stack = (error.stack || error).toString();
            var pat = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(stack);
            if (pat) {
                return pat[1];
            }
            var pat2 = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(stack);
            if (pat2) {
                return pat2[1];
            }
            return 'unknown';
        }
        function parseSource(source, command) {
            var lines = source.split('\n');
            var lineNumber = 1;
            var fileNumber = 0;
            var files = {
                unknown: new ShaderFile(),
                0: new ShaderFile()
            };
            files.unknown.name = files[0].name = command || guessCommand();
            files.unknown.lines.push(new ShaderLine(0, ''));
            for (var i = 0; i < lines.length; ++i) {
                var line = lines[i];
                var parts = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(line);
                if (parts) {
                    switch (parts[1]) {
                        case 'line':
                            var lineNumberInfo = /(\d+)(\s+\d+)?/.exec(parts[2]);
                            if (lineNumberInfo) {
                                lineNumber = lineNumberInfo[1] | 0;
                                if (lineNumberInfo[2]) {
                                    fileNumber = lineNumberInfo[2] | 0;
                                    if (!(fileNumber in files)) {
                                        files[fileNumber] = new ShaderFile();
                                    }
                                }
                            }
                            break;
                        case 'define':
                            var nameInfo = /SHADER_NAME(_B64)?\s+(.*)$/.exec(parts[2]);
                            if (nameInfo) {
                                files[fileNumber].name = (nameInfo[1]
                                    ? decodeB64(nameInfo[2])
                                    : nameInfo[2]);
                            }
                            break;
                    }
                }
                files[fileNumber].lines.push(new ShaderLine(lineNumber++, line));
            }
            Object.keys(files).forEach(function (fileNumber) {
                var file = files[fileNumber];
                file.lines.forEach(function (line) {
                    file.index[line.number] = line;
                });
            });
            return files;
        }
        function parseErrorLog(errLog) {
            var result = [];
            errLog.split('\n').forEach(function (errMsg) {
                if (errMsg.length < 5) {
                    return;
                }
                var parts = /^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(errMsg);
                if (parts) {
                    result.push(new ShaderError(parts[1] | 0, parts[2] | 0, parts[3].trim()));
                }
                else if (errMsg.length > 0) {
                    result.push(new ShaderError('unknown', 0, errMsg));
                }
            });
            return result;
        }
        function annotateFiles(files, errors) {
            errors.forEach(function (error) {
                var file = files[error.file];
                if (file) {
                    var line = file.index[error.line];
                    if (line) {
                        line.errors.push(error);
                        file.hasErrors = true;
                        return;
                    }
                }
                files.unknown.hasErrors = true;
                files.unknown.lines[0].errors.push(error);
            });
        }
        function checkShaderError(gl, shader, source, type, command) {
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                var errLog = gl.getShaderInfoLog(shader);
                var typeName = type === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex';
                checkCommandType(source, 'string', typeName + ' shader source must be a string', command);
                var files = parseSource(source, command);
                var errors = parseErrorLog(errLog);
                annotateFiles(files, errors);
                Object.keys(files).forEach(function (fileNumber) {
                    var file = files[fileNumber];
                    if (!file.hasErrors) {
                        return;
                    }
                    var strings = [''];
                    var styles = [''];
                    function push(str, style) {
                        strings.push(str);
                        styles.push(style || '');
                    }
                    push('file number ' + fileNumber + ': ' + file.name + '\n', 'color:red;text-decoration:underline;font-weight:bold');
                    file.lines.forEach(function (line) {
                        if (line.errors.length > 0) {
                            push(leftPad(line.number, 4) + '|  ', 'background-color:yellow; font-weight:bold');
                            push(line.line + endl, 'color:red; background-color:yellow; font-weight:bold');
                            // try to guess token
                            var offset = 0;
                            line.errors.forEach(function (error) {
                                var message = error.message;
                                var token = /^\s*'(.*)'\s*:\s*(.*)$/.exec(message);
                                if (token) {
                                    var tokenPat = token[1];
                                    message = token[2];
                                    switch (tokenPat) {
                                        case 'assign':
                                            tokenPat = '=';
                                            break;
                                    }
                                    offset = Math.max(line.line.indexOf(tokenPat, offset), 0);
                                }
                                else {
                                    offset = 0;
                                }
                                push(leftPad('| ', 6));
                                push(leftPad('^^^', offset + 3) + endl, 'font-weight:bold');
                                push(leftPad('| ', 6));
                                push(message + endl, 'font-weight:bold');
                            });
                            push(leftPad('| ', 6) + endl);
                        }
                        else {
                            push(leftPad(line.number, 4) + '|  ');
                            push(line.line + endl, 'color:red');
                        }
                    });
                    if (typeof document !== 'undefined' && !window.chrome) {
                        styles[0] = strings.join('%c');
                        console.log.apply(console, styles);
                    }
                    else {
                        console.log(strings.join(''));
                    }
                });
                check.raise('Error compiling ' + typeName + ' shader, ' + files[0].name);
            }
        }
        function checkLinkError(gl, program, fragShader, vertShader, command) {
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                var errLog = gl.getProgramInfoLog(program);
                var fragParse = parseSource(fragShader, command);
                var vertParse = parseSource(vertShader, command);
                var header = 'Error linking program with vertex shader, "' +
                    vertParse[0].name + '", and fragment shader "' + fragParse[0].name + '"';
                if (typeof document !== 'undefined') {
                    console.log('%c' + header + endl + '%c' + errLog, 'color:red;text-decoration:underline;font-weight:bold', 'color:red');
                }
                else {
                    console.log(header + endl + errLog);
                }
                check.raise(header);
            }
        }
        function saveCommandRef(object) {
            object._commandRef = guessCommand();
        }
        function saveDrawCommandInfo(opts, uniforms, attributes, stringStore) {
            saveCommandRef(opts);
            function id(str) {
                if (str) {
                    return stringStore.id(str);
                }
                return 0;
            }
            opts._fragId = id(opts.static.frag);
            opts._vertId = id(opts.static.vert);
            function addProps(dict, set) {
                Object.keys(set).forEach(function (u) {
                    dict[stringStore.id(u)] = true;
                });
            }
            var uniformSet = opts._uniformSet = {};
            addProps(uniformSet, uniforms.static);
            addProps(uniformSet, uniforms.dynamic);
            var attributeSet = opts._attributeSet = {};
            addProps(attributeSet, attributes.static);
            addProps(attributeSet, attributes.dynamic);
            opts._hasCount = ('count' in opts.static ||
                'count' in opts.dynamic ||
                'elements' in opts.static ||
                'elements' in opts.dynamic);
        }
        function commandRaise(message, command) {
            var callSite = guessCallSite();
            raise(message +
                ' in command ' + (command || guessCommand()) +
                (callSite === 'unknown' ? '' : ' called from ' + callSite));
        }
        function checkCommand(pred, message, command) {
            if (!pred) {
                commandRaise(message, command || guessCommand());
            }
        }
        function checkParameterCommand(param, possibilities, message, command) {
            if (!(param in possibilities)) {
                commandRaise('unknown parameter (' + param + ')' + encolon(message) +
                    '. possible values: ' + Object.keys(possibilities).join(), command || guessCommand());
            }
        }
        function checkCommandType(value, type, message, command) {
            if (!standardTypeEh(value, type)) {
                commandRaise('invalid parameter type' + encolon(message) +
                    '. expected ' + type + ', got ' + (typeof value), command || guessCommand());
            }
        }
        function checkOptional(block) {
            block();
        }
        function checkFramebufferFormat(attachment, texFormats, rbFormats) {
            if (attachment.texture) {
                checkOneOf(attachment.texture._texture.internalformat, texFormats, 'unsupported texture format for attachment');
            }
            else {
                checkOneOf(attachment.renderbuffer._renderbuffer.format, rbFormats, 'unsupported renderbuffer format for attachment');
            }
        }
        var GL_CLAMP_TO_EDGE = 0x812F;
        var GL_NEAREST = 0x2600;
        var GL_NEAREST_MIPMAP_NEAREST = 0x2700;
        var GL_LINEAR_MIPMAP_NEAREST = 0x2701;
        var GL_NEAREST_MIPMAP_LINEAR = 0x2702;
        var GL_LINEAR_MIPMAP_LINEAR = 0x2703;
        var GL_BYTE = 5120;
        var GL_UNSIGNED_BYTE = 5121;
        var GL_SHORT = 5122;
        var GL_UNSIGNED_SHORT = 5123;
        var GL_INT = 5124;
        var GL_UNSIGNED_INT = 5125;
        var GL_FLOAT = 5126;
        var GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033;
        var GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034;
        var GL_UNSIGNED_SHORT_5_6_5 = 0x8363;
        var GL_UNSIGNED_INT_24_8_WEBGL = 0x84FA;
        var GL_HALF_FLOAT_OES = 0x8D61;
        var TYPE_SIZE = {};
        TYPE_SIZE[GL_BYTE] =
            TYPE_SIZE[GL_UNSIGNED_BYTE] = 1;
        TYPE_SIZE[GL_SHORT] =
            TYPE_SIZE[GL_UNSIGNED_SHORT] =
                TYPE_SIZE[GL_HALF_FLOAT_OES] =
                    TYPE_SIZE[GL_UNSIGNED_SHORT_5_6_5] =
                        TYPE_SIZE[GL_UNSIGNED_SHORT_4_4_4_4] =
                            TYPE_SIZE[GL_UNSIGNED_SHORT_5_5_5_1] = 2;
        TYPE_SIZE[GL_INT] =
            TYPE_SIZE[GL_UNSIGNED_INT] =
                TYPE_SIZE[GL_FLOAT] =
                    TYPE_SIZE[GL_UNSIGNED_INT_24_8_WEBGL] = 4;
        function pixelSize(type, channels) {
            if (type === GL_UNSIGNED_SHORT_5_5_5_1 ||
                type === GL_UNSIGNED_SHORT_4_4_4_4 ||
                type === GL_UNSIGNED_SHORT_5_6_5) {
                return 2;
            }
            else if (type === GL_UNSIGNED_INT_24_8_WEBGL) {
                return 4;
            }
            else {
                return TYPE_SIZE[type] * channels;
            }
        }
        function isPow2(v) {
            return !(v & (v - 1)) && (!!v);
        }
        function checkTexture2D(info, mipData, limits) {
            var i;
            var w = mipData.width;
            var h = mipData.height;
            var c = mipData.channels;
            // Check texture shape
            check(w > 0 && w <= limits.maxTextureSize &&
                h > 0 && h <= limits.maxTextureSize, 'invalid texture shape');
            // check wrap mode
            if (info.wrapS !== GL_CLAMP_TO_EDGE || info.wrapT !== GL_CLAMP_TO_EDGE) {
                check(isPow2(w) && isPow2(h), 'incompatible wrap mode for texture, both width and height must be power of 2');
            }
            if (mipData.mipmask === 1) {
                if (w !== 1 && h !== 1) {
                    check(info.minFilter !== GL_NEAREST_MIPMAP_NEAREST &&
                        info.minFilter !== GL_NEAREST_MIPMAP_LINEAR &&
                        info.minFilter !== GL_LINEAR_MIPMAP_NEAREST &&
                        info.minFilter !== GL_LINEAR_MIPMAP_LINEAR, 'min filter requires mipmap');
                }
            }
            else {
                // texture must be power of 2
                check(isPow2(w) && isPow2(h), 'texture must be a square power of 2 to support mipmapping');
                check(mipData.mipmask === (w << 1) - 1, 'missing or incomplete mipmap data');
            }
            if (mipData.type === GL_FLOAT) {
                if (limits.extensions.indexOf('oes_texture_float_linear') < 0) {
                    check(info.minFilter === GL_NEAREST && info.magFilter === GL_NEAREST, 'filter not supported, must enable oes_texture_float_linear');
                }
                check(!info.genMipmaps, 'mipmap generation not supported with float textures');
            }
            // check image complete
            var mipimages = mipData.images;
            for (i = 0; i < 16; ++i) {
                if (mipimages[i]) {
                    var mw = w >> i;
                    var mh = h >> i;
                    check(mipData.mipmask & (1 << i), 'missing mipmap data');
                    var img = mipimages[i];
                    check(img.width === mw &&
                        img.height === mh, 'invalid shape for mip images');
                    check(img.format === mipData.format &&
                        img.internalformat === mipData.internalformat &&
                        img.type === mipData.type, 'incompatible type for mip image');
                    if (img.compressed) {
                        // TODO: check size for compressed images
                    }
                    else if (img.data) {
                        // check(img.data.byteLength === mw * mh *
                        // Math.max(pixelSize(img.type, c), img.unpackAlignment),
                        var rowSize = Math.ceil(pixelSize(img.type, c) * mw / img.unpackAlignment) * img.unpackAlignment;
                        check(img.data.byteLength === rowSize * mh, 'invalid data for image, buffer size is inconsistent with image format');
                    }
                    else if (img.element) {
                        // TODO: check element can be loaded
                    }
                    else if (img.copy) {
                        // TODO: check compatible format and type
                    }
                }
                else if (!info.genMipmaps) {
                    check((mipData.mipmask & (1 << i)) === 0, 'extra mipmap data');
                }
            }
            if (mipData.compressed) {
                check(!info.genMipmaps, 'mipmap generation for compressed images not supported');
            }
        }
        function checkTextureCube(texture, info, faces, limits) {
            var w = texture.width;
            var h = texture.height;
            var c = texture.channels;
            // Check texture shape
            check(w > 0 && w <= limits.maxTextureSize && h > 0 && h <= limits.maxTextureSize, 'invalid texture shape');
            check(w === h, 'cube map must be square');
            check(info.wrapS === GL_CLAMP_TO_EDGE && info.wrapT === GL_CLAMP_TO_EDGE, 'wrap mode not supported by cube map');
            for (var i = 0; i < faces.length; ++i) {
                var face = faces[i];
                check(face.width === w && face.height === h, 'inconsistent cube map face shape');
                if (info.genMipmaps) {
                    check(!face.compressed, 'can not generate mipmap for compressed textures');
                    check(face.mipmask === 1, 'can not specify mipmaps and generate mipmaps');
                }
                else {
                    // TODO: check mip and filter mode
                }
                var mipmaps = face.images;
                for (var j = 0; j < 16; ++j) {
                    var img = mipmaps[j];
                    if (img) {
                        var mw = w >> j;
                        var mh = h >> j;
                        check(face.mipmask & (1 << j), 'missing mipmap data');
                        check(img.width === mw &&
                            img.height === mh, 'invalid shape for mip images');
                        check(img.format === texture.format &&
                            img.internalformat === texture.internalformat &&
                            img.type === texture.type, 'incompatible type for mip image');
                        if (img.compressed) {
                            // TODO: check size for compressed images
                        }
                        else if (img.data) {
                            check(img.data.byteLength === mw * mh *
                                Math.max(pixelSize(img.type, c), img.unpackAlignment), 'invalid data for image, buffer size is inconsistent with image format');
                        }
                        else if (img.element) {
                            // TODO: check element can be loaded
                        }
                        else if (img.copy) {
                            // TODO: check compatible format and type
                        }
                    }
                }
            }
        }
        var check$1 = extend(check, {
            optional: checkOptional,
            raise: raise,
            commandRaise: commandRaise,
            command: checkCommand,
            parameter: checkParameter,
            commandParameter: checkParameterCommand,
            constructor: checkConstructor,
            type: checkTypeOf,
            commandType: checkCommandType,
            isTypedArray: checkIsTypedArray,
            nni: checkNonNegativeInt,
            oneOf: checkOneOf,
            shaderError: checkShaderError,
            linkError: checkLinkError,
            callSite: guessCallSite,
            saveCommandRef: saveCommandRef,
            saveDrawInfo: saveDrawCommandInfo,
            framebufferFormat: checkFramebufferFormat,
            guessCommand: guessCommand,
            texture2D: checkTexture2D,
            textureCube: checkTextureCube
        });
        var VARIABLE_COUNTER = 0;
        var DYN_FUNC = 0;
        var DYN_CONSTANT = 5;
        var DYN_ARRAY = 6;
        function DynamicVariable(type, data) {
            this.id = (VARIABLE_COUNTER++);
            this.type = type;
            this.data = data;
        }
        function escapeStr(str) {
            return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        }
        function splitParts(str) {
            if (str.length === 0) {
                return [];
            }
            var firstChar = str.charAt(0);
            var lastChar = str.charAt(str.length - 1);
            if (str.length > 1 &&
                firstChar === lastChar &&
                (firstChar === '"' || firstChar === "'")) {
                return ['"' + escapeStr(str.substr(1, str.length - 2)) + '"'];
            }
            var parts = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(str);
            if (parts) {
                return (splitParts(str.substr(0, parts.index))
                    .concat(splitParts(parts[1]))
                    .concat(splitParts(str.substr(parts.index + parts[0].length))));
            }
            var subparts = str.split('.');
            if (subparts.length === 1) {
                return ['"' + escapeStr(str) + '"'];
            }
            var result = [];
            for (var i = 0; i < subparts.length; ++i) {
                result = result.concat(splitParts(subparts[i]));
            }
            return result;
        }
        function toAccessorString(str) {
            return '[' + splitParts(str).join('][') + ']';
        }
        function defineDynamic(type, data) {
            return new DynamicVariable(type, toAccessorString(data + ''));
        }
        function isDynamic(x) {
            return (typeof x === 'function' && !x._reglType) || (x instanceof DynamicVariable);
        }
        function unbox(x, path) {
            if (typeof x === 'function') {
                return new DynamicVariable(DYN_FUNC, x);
            }
            else if (typeof x === 'number' || typeof x === 'boolean') {
                return new DynamicVariable(DYN_CONSTANT, x);
            }
            else if (Array.isArray(x)) {
                return new DynamicVariable(DYN_ARRAY, x.map(function (y, i) { return unbox(y, path + '[' + i + ']'); }));
            }
            else if (x instanceof DynamicVariable) {
                return x;
            }
            check$1(false, 'invalid option type in uniform ' + path);
        }
        var dynamic = {
            DynamicVariable: DynamicVariable,
            define: defineDynamic,
            isDynamic: isDynamic,
            unbox: unbox,
            accessor: toAccessorString
        };
        /* globals requestAnimationFrame, cancelAnimationFrame */
        var raf = {
            next: typeof requestAnimationFrame === 'function'
                ? function (cb) { return requestAnimationFrame(cb); }
                : function (cb) { return setTimeout(cb, 16); },
            cancel: typeof cancelAnimationFrame === 'function'
                ? function (raf) { return cancelAnimationFrame(raf); }
                : clearTimeout
        };
        /* globals performance */
        var clock = (typeof performance !== 'undefined' && performance.now)
            ? function () { return performance.now(); }
            : function () { return +(new Date()); };
        function createStringStore() {
            var stringIds = { '': 0 };
            var stringValues = [''];
            return {
                id: function (str) {
                    var result = stringIds[str];
                    if (result) {
                        return result;
                    }
                    result = stringIds[str] = stringValues.length;
                    stringValues.push(str);
                    return result;
                },
                str: function (id) {
                    return stringValues[id];
                }
            };
        }
        // Context and canvas creation helper functions
        function createCanvas(element, onDone, pixelRatio) {
            var canvas = document.createElement('canvas');
            extend(canvas.style, {
                border: 0,
                margin: 0,
                padding: 0,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            });
            element.appendChild(canvas);
            if (element === document.body) {
                canvas.style.position = 'absolute';
                extend(element.style, {
                    margin: 0,
                    padding: 0
                });
            }
            function resize() {
                var w = window.innerWidth;
                var h = window.innerHeight;
                if (element !== document.body) {
                    var bounds = canvas.getBoundingClientRect();
                    w = bounds.right - bounds.left;
                    h = bounds.bottom - bounds.top;
                }
                canvas.width = pixelRatio * w;
                canvas.height = pixelRatio * h;
            }
            var resizeObserver;
            if (element !== document.body && typeof ResizeObserver === 'function') {
                // ignore 'ResizeObserver' is not defined
                // eslint-disable-next-line
                resizeObserver = new ResizeObserver(function () {
                    // setTimeout to avoid flicker
                    setTimeout(resize);
                });
                resizeObserver.observe(element);
            }
            else {
                window.addEventListener('resize', resize, false);
            }
            function onDestroy() {
                if (resizeObserver) {
                    resizeObserver.disconnect();
                }
                else {
                    window.removeEventListener('resize', resize);
                }
                element.removeChild(canvas);
            }
            resize();
            return {
                canvas: canvas,
                onDestroy: onDestroy
            };
        }
        function createContext(canvas, contextAttributes) {
            function get(name) {
                try {
                    return canvas.getContext(name, contextAttributes);
                }
                catch (e) {
                    return null;
                }
            }
            return (get('webgl') ||
                get('experimental-webgl') ||
                get('webgl-experimental'));
        }
        function isHTMLElement(obj) {
            return (typeof obj.nodeName === 'string' &&
                typeof obj.appendChild === 'function' &&
                typeof obj.getBoundingClientRect === 'function');
        }
        function isWebGLContext(obj) {
            return (typeof obj.drawArrays === 'function' ||
                typeof obj.drawElements === 'function');
        }
        function parseExtensions(input) {
            if (typeof input === 'string') {
                return input.split();
            }
            check$1(Array.isArray(input), 'invalid extension array');
            return input;
        }
        function getElement(desc) {
            if (typeof desc === 'string') {
                check$1(typeof document !== 'undefined', 'not supported outside of DOM');
                return document.querySelector(desc);
            }
            return desc;
        }
        function parseArgs(args_) {
            var args = args_ || {};
            var element, container, canvas, gl;
            var contextAttributes = {};
            var extensions = [];
            var optionalExtensions = [];
            var pixelRatio = (typeof window === 'undefined' ? 1 : window.devicePixelRatio);
            var profile = false;
            var onDone = function (err) {
                if (err) {
                    check$1.raise(err);
                }
            };
            var onDestroy = function () { };
            if (typeof args === 'string') {
                check$1(typeof document !== 'undefined', 'selector queries only supported in DOM enviroments');
                element = document.querySelector(args);
                check$1(element, 'invalid query string for element');
            }
            else if (typeof args === 'object') {
                if (isHTMLElement(args)) {
                    element = args;
                }
                else if (isWebGLContext(args)) {
                    gl = args;
                    canvas = gl.canvas;
                }
                else {
                    check$1.constructor(args);
                    if ('gl' in args) {
                        gl = args.gl;
                    }
                    else if ('canvas' in args) {
                        canvas = getElement(args.canvas);
                    }
                    else if ('container' in args) {
                        container = getElement(args.container);
                    }
                    if ('attributes' in args) {
                        contextAttributes = args.attributes;
                        check$1.type(contextAttributes, 'object', 'invalid context attributes');
                    }
                    if ('extensions' in args) {
                        extensions = parseExtensions(args.extensions);
                    }
                    if ('optionalExtensions' in args) {
                        optionalExtensions = parseExtensions(args.optionalExtensions);
                    }
                    if ('onDone' in args) {
                        check$1.type(args.onDone, 'function', 'invalid or missing onDone callback');
                        onDone = args.onDone;
                    }
                    if ('profile' in args) {
                        profile = !!args.profile;
                    }
                    if ('pixelRatio' in args) {
                        pixelRatio = +args.pixelRatio;
                        check$1(pixelRatio > 0, 'invalid pixel ratio');
                    }
                }
            }
            else {
                check$1.raise('invalid arguments to regl');
            }
            if (element) {
                if (element.nodeName.toLowerCase() === 'canvas') {
                    canvas = element;
                }
                else {
                    container = element;
                }
            }
            if (!gl) {
                if (!canvas) {
                    check$1(typeof document !== 'undefined', 'must manually specify webgl context outside of DOM environments');
                    var result = createCanvas(container || document.body, onDone, pixelRatio);
                    if (!result) {
                        return null;
                    }
                    canvas = result.canvas;
                    onDestroy = result.onDestroy;
                }
                // workaround for chromium bug, premultiplied alpha value is platform dependent
                if (contextAttributes.premultipliedAlpha === undefined)
                    contextAttributes.premultipliedAlpha = true;
                gl = createContext(canvas, contextAttributes);
            }
            if (!gl) {
                onDestroy();
                onDone('webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org');
                return null;
            }
            return {
                gl: gl,
                canvas: canvas,
                container: container,
                extensions: extensions,
                optionalExtensions: optionalExtensions,
                pixelRatio: pixelRatio,
                profile: profile,
                onDone: onDone,
                onDestroy: onDestroy
            };
        }
        function createExtensionCache(gl, config) {
            var extensions = {};
            function tryLoadExtension(name_) {
                check$1.type(name_, 'string', 'extension name must be string');
                var name = name_.toLowerCase();
                var ext;
                try {
                    ext = extensions[name] = gl.getExtension(name);
                }
                catch (e) { }
                return !!ext;
            }
            for (var i = 0; i < config.extensions.length; ++i) {
                var name = config.extensions[i];
                if (!tryLoadExtension(name)) {
                    config.onDestroy();
                    config.onDone('"' + name + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser');
                    return null;
                }
            }
            config.optionalExtensions.forEach(tryLoadExtension);
            return {
                extensions: extensions,
                restore: function () {
                    Object.keys(extensions).forEach(function (name) {
                        if (extensions[name] && !tryLoadExtension(name)) {
                            throw new Error('(regl): error restoring extension ' + name);
                        }
                    });
                }
            };
        }
        function loop(n, f) {
            var result = Array(n);
            for (var i = 0; i < n; ++i) {
                result[i] = f(i);
            }
            return result;
        }
        var GL_BYTE$1 = 5120;
        var GL_UNSIGNED_BYTE$2 = 5121;
        var GL_SHORT$1 = 5122;
        var GL_UNSIGNED_SHORT$1 = 5123;
        var GL_INT$1 = 5124;
        var GL_UNSIGNED_INT$1 = 5125;
        var GL_FLOAT$2 = 5126;
        function nextPow16(v) {
            for (var i = 16; i <= (1 << 28); i *= 16) {
                if (v <= i) {
                    return i;
                }
            }
            return 0;
        }
        function log2(v) {
            var r, shift;
            r = (v > 0xFFFF) << 4;
            v >>>= r;
            shift = (v > 0xFF) << 3;
            v >>>= shift;
            r |= shift;
            shift = (v > 0xF) << 2;
            v >>>= shift;
            r |= shift;
            shift = (v > 0x3) << 1;
            v >>>= shift;
            r |= shift;
            return r | (v >> 1);
        }
        function createPool() {
            var bufferPool = loop(8, function () {
                return [];
            });
            function alloc(n) {
                var sz = nextPow16(n);
                var bin = bufferPool[log2(sz) >> 2];
                if (bin.length > 0) {
                    return bin.pop();
                }
                return new ArrayBuffer(sz);
            }
            function free(buf) {
                bufferPool[log2(buf.byteLength) >> 2].push(buf);
            }
            function allocType(type, n) {
                var result = null;
                switch (type) {
                    case GL_BYTE$1:
                        result = new Int8Array(alloc(n), 0, n);
                        break;
                    case GL_UNSIGNED_BYTE$2:
                        result = new Uint8Array(alloc(n), 0, n);
                        break;
                    case GL_SHORT$1:
                        result = new Int16Array(alloc(2 * n), 0, n);
                        break;
                    case GL_UNSIGNED_SHORT$1:
                        result = new Uint16Array(alloc(2 * n), 0, n);
                        break;
                    case GL_INT$1:
                        result = new Int32Array(alloc(4 * n), 0, n);
                        break;
                    case GL_UNSIGNED_INT$1:
                        result = new Uint32Array(alloc(4 * n), 0, n);
                        break;
                    case GL_FLOAT$2:
                        result = new Float32Array(alloc(4 * n), 0, n);
                        break;
                    default:
                        return null;
                }
                if (result.length !== n) {
                    return result.subarray(0, n);
                }
                return result;
            }
            function freeType(array) {
                free(array.buffer);
            }
            return {
                alloc: alloc,
                free: free,
                allocType: allocType,
                freeType: freeType
            };
        }
        var pool = createPool();
        // zero pool for initial zero data
        pool.zero = createPool();
        var GL_SUBPIXEL_BITS = 0x0D50;
        var GL_RED_BITS = 0x0D52;
        var GL_GREEN_BITS = 0x0D53;
        var GL_BLUE_BITS = 0x0D54;
        var GL_ALPHA_BITS = 0x0D55;
        var GL_DEPTH_BITS = 0x0D56;
        var GL_STENCIL_BITS = 0x0D57;
        var GL_ALIASED_POINT_SIZE_RANGE = 0x846D;
        var GL_ALIASED_LINE_WIDTH_RANGE = 0x846E;
        var GL_MAX_TEXTURE_SIZE = 0x0D33;
        var GL_MAX_VIEWPORT_DIMS = 0x0D3A;
        var GL_MAX_VERTEX_ATTRIBS = 0x8869;
        var GL_MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB;
        var GL_MAX_VARYING_VECTORS = 0x8DFC;
        var GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
        var GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C;
        var GL_MAX_TEXTURE_IMAGE_UNITS = 0x8872;
        var GL_MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD;
        var GL_MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C;
        var GL_MAX_RENDERBUFFER_SIZE = 0x84E8;
        var GL_VENDOR = 0x1F00;
        var GL_RENDERER = 0x1F01;
        var GL_VERSION = 0x1F02;
        var GL_SHADING_LANGUAGE_VERSION = 0x8B8C;
        var GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;
        var GL_MAX_COLOR_ATTACHMENTS_WEBGL = 0x8CDF;
        var GL_MAX_DRAW_BUFFERS_WEBGL = 0x8824;
        var GL_TEXTURE_2D = 0x0DE1;
        var GL_TEXTURE_CUBE_MAP = 0x8513;
        var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
        var GL_TEXTURE0 = 0x84C0;
        var GL_RGBA = 0x1908;
        var GL_FLOAT$1 = 0x1406;
        var GL_UNSIGNED_BYTE$1 = 0x1401;
        var GL_FRAMEBUFFER = 0x8D40;
        var GL_FRAMEBUFFER_COMPLETE = 0x8CD5;
        var GL_COLOR_ATTACHMENT0 = 0x8CE0;
        var GL_COLOR_BUFFER_BIT$1 = 0x4000;
        var wrapLimits = function (gl, extensions) {
            var maxAnisotropic = 1;
            if (extensions.ext_texture_filter_anisotropic) {
                maxAnisotropic = gl.getParameter(GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            }
            var maxDrawbuffers = 1;
            var maxColorAttachments = 1;
            if (extensions.webgl_draw_buffers) {
                maxDrawbuffers = gl.getParameter(GL_MAX_DRAW_BUFFERS_WEBGL);
                maxColorAttachments = gl.getParameter(GL_MAX_COLOR_ATTACHMENTS_WEBGL);
            }
            // detect if reading float textures is available (Safari doesn't support)
            var readFloat = !!extensions.oes_texture_float;
            if (readFloat) {
                var readFloatTexture = gl.createTexture();
                gl.bindTexture(GL_TEXTURE_2D, readFloatTexture);
                gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 1, 1, 0, GL_RGBA, GL_FLOAT$1, null);
                var fbo = gl.createFramebuffer();
                gl.bindFramebuffer(GL_FRAMEBUFFER, fbo);
                gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, readFloatTexture, 0);
                gl.bindTexture(GL_TEXTURE_2D, null);
                if (gl.checkFramebufferStatus(GL_FRAMEBUFFER) !== GL_FRAMEBUFFER_COMPLETE)
                    readFloat = false;
                else {
                    gl.viewport(0, 0, 1, 1);
                    gl.clearColor(1.0, 0.0, 0.0, 1.0);
                    gl.clear(GL_COLOR_BUFFER_BIT$1);
                    var pixels = pool.allocType(GL_FLOAT$1, 4);
                    gl.readPixels(0, 0, 1, 1, GL_RGBA, GL_FLOAT$1, pixels);
                    if (gl.getError())
                        readFloat = false;
                    else {
                        gl.deleteFramebuffer(fbo);
                        gl.deleteTexture(readFloatTexture);
                        readFloat = pixels[0] === 1.0;
                    }
                    pool.freeType(pixels);
                }
            }
            // detect non power of two cube textures support (IE doesn't support)
            var isIE = typeof navigator !== 'undefined' && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent));
            var npotTextureCube = true;
            if (!isIE) {
                var cubeTexture = gl.createTexture();
                var data = pool.allocType(GL_UNSIGNED_BYTE$1, 36);
                gl.activeTexture(GL_TEXTURE0);
                gl.bindTexture(GL_TEXTURE_CUBE_MAP, cubeTexture);
                gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X, 0, GL_RGBA, 3, 3, 0, GL_RGBA, GL_UNSIGNED_BYTE$1, data);
                pool.freeType(data);
                gl.bindTexture(GL_TEXTURE_CUBE_MAP, null);
                gl.deleteTexture(cubeTexture);
                npotTextureCube = !gl.getError();
            }
            return {
                // drawing buffer bit depth
                colorBits: [
                    gl.getParameter(GL_RED_BITS),
                    gl.getParameter(GL_GREEN_BITS),
                    gl.getParameter(GL_BLUE_BITS),
                    gl.getParameter(GL_ALPHA_BITS)
                ],
                depthBits: gl.getParameter(GL_DEPTH_BITS),
                stencilBits: gl.getParameter(GL_STENCIL_BITS),
                subpixelBits: gl.getParameter(GL_SUBPIXEL_BITS),
                // supported extensions
                extensions: Object.keys(extensions).filter(function (ext) {
                    return !!extensions[ext];
                }),
                // max aniso samples
                maxAnisotropic: maxAnisotropic,
                // max draw buffers
                maxDrawbuffers: maxDrawbuffers,
                maxColorAttachments: maxColorAttachments,
                // point and line size ranges
                pointSizeDims: gl.getParameter(GL_ALIASED_POINT_SIZE_RANGE),
                lineWidthDims: gl.getParameter(GL_ALIASED_LINE_WIDTH_RANGE),
                maxViewportDims: gl.getParameter(GL_MAX_VIEWPORT_DIMS),
                maxCombinedTextureUnits: gl.getParameter(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS),
                maxCubeMapSize: gl.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE),
                maxRenderbufferSize: gl.getParameter(GL_MAX_RENDERBUFFER_SIZE),
                maxTextureUnits: gl.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS),
                maxTextureSize: gl.getParameter(GL_MAX_TEXTURE_SIZE),
                maxAttributes: gl.getParameter(GL_MAX_VERTEX_ATTRIBS),
                maxVertexUniforms: gl.getParameter(GL_MAX_VERTEX_UNIFORM_VECTORS),
                maxVertexTextureUnits: gl.getParameter(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS),
                maxVaryingVectors: gl.getParameter(GL_MAX_VARYING_VECTORS),
                maxFragmentUniforms: gl.getParameter(GL_MAX_FRAGMENT_UNIFORM_VECTORS),
                // vendor info
                glsl: gl.getParameter(GL_SHADING_LANGUAGE_VERSION),
                renderer: gl.getParameter(GL_RENDERER),
                vendor: gl.getParameter(GL_VENDOR),
                version: gl.getParameter(GL_VERSION),
                // quirks
                readFloat: readFloat,
                npotTextureCube: npotTextureCube
            };
        };
        function isNDArrayLike(obj) {
            return (!!obj &&
                typeof obj === 'object' &&
                Array.isArray(obj.shape) &&
                Array.isArray(obj.stride) &&
                typeof obj.offset === 'number' &&
                obj.shape.length === obj.stride.length &&
                (Array.isArray(obj.data) ||
                    isTypedArray(obj.data)));
        }
        var values = function (obj) {
            return Object.keys(obj).map(function (key) { return obj[key]; });
        };
        var flattenUtils = {
            shape: arrayShape$1,
            flatten: flattenArray
        };
        function flatten1D(array, nx, out) {
            for (var i = 0; i < nx; ++i) {
                out[i] = array[i];
            }
        }
        function flatten2D(array, nx, ny, out) {
            var ptr = 0;
            for (var i = 0; i < nx; ++i) {
                var row = array[i];
                for (var j = 0; j < ny; ++j) {
                    out[ptr++] = row[j];
                }
            }
        }
        function flatten3D(array, nx, ny, nz, out, ptr_) {
            var ptr = ptr_;
            for (var i = 0; i < nx; ++i) {
                var row = array[i];
                for (var j = 0; j < ny; ++j) {
                    var col = row[j];
                    for (var k = 0; k < nz; ++k) {
                        out[ptr++] = col[k];
                    }
                }
            }
        }
        function flattenRec(array, shape, level, out, ptr) {
            var stride = 1;
            for (var i = level + 1; i < shape.length; ++i) {
                stride *= shape[i];
            }
            var n = shape[level];
            if (shape.length - level === 4) {
                var nx = shape[level + 1];
                var ny = shape[level + 2];
                var nz = shape[level + 3];
                for (i = 0; i < n; ++i) {
                    flatten3D(array[i], nx, ny, nz, out, ptr);
                    ptr += stride;
                }
            }
            else {
                for (i = 0; i < n; ++i) {
                    flattenRec(array[i], shape, level + 1, out, ptr);
                    ptr += stride;
                }
            }
        }
        function flattenArray(array, shape, type, out_) {
            var sz = 1;
            if (shape.length) {
                for (var i = 0; i < shape.length; ++i) {
                    sz *= shape[i];
                }
            }
            else {
                sz = 0;
            }
            var out = out_ || pool.allocType(type, sz);
            switch (shape.length) {
                case 0:
                    break;
                case 1:
                    flatten1D(array, shape[0], out);
                    break;
                case 2:
                    flatten2D(array, shape[0], shape[1], out);
                    break;
                case 3:
                    flatten3D(array, shape[0], shape[1], shape[2], out, 0);
                    break;
                default:
                    flattenRec(array, shape, 0, out, 0);
            }
            return out;
        }
        function arrayShape$1(array_) {
            var shape = [];
            for (var array = array_; array.length; array = array[0]) {
                shape.push(array.length);
            }
            return shape;
        }
        var arrayTypes = {
            "[object Int8Array]": 5120,
            "[object Int16Array]": 5122,
            "[object Int32Array]": 5124,
            "[object Uint8Array]": 5121,
            "[object Uint8ClampedArray]": 5121,
            "[object Uint16Array]": 5123,
            "[object Uint32Array]": 5125,
            "[object Float32Array]": 5126,
            "[object Float64Array]": 5121,
            "[object ArrayBuffer]": 5121
        };
        var int8 = 5120;
        var int16 = 5122;
        var int32 = 5124;
        var uint8 = 5121;
        var uint16 = 5123;
        var uint32 = 5125;
        var float = 5126;
        var float32 = 5126;
        var glTypes = {
            int8: int8,
            int16: int16,
            int32: int32,
            uint8: uint8,
            uint16: uint16,
            uint32: uint32,
            float: float,
            float32: float32
        };
        var dynamic$1 = 35048;
        var stream = 35040;
        var usageTypes = {
            dynamic: dynamic$1,
            stream: stream,
            "static": 35044
        };
        var arrayFlatten = flattenUtils.flatten;
        var arrayShape = flattenUtils.shape;
        var GL_STATIC_DRAW = 0x88E4;
        var GL_STREAM_DRAW = 0x88E0;
        var GL_UNSIGNED_BYTE$3 = 5121;
        var GL_FLOAT$3 = 5126;
        var DTYPES_SIZES = [];
        DTYPES_SIZES[5120] = 1; // int8
        DTYPES_SIZES[5122] = 2; // int16
        DTYPES_SIZES[5124] = 4; // int32
        DTYPES_SIZES[5121] = 1; // uint8
        DTYPES_SIZES[5123] = 2; // uint16
        DTYPES_SIZES[5125] = 4; // uint32
        DTYPES_SIZES[5126] = 4; // float32
        function typedArrayCode(data) {
            return arrayTypes[Object.prototype.toString.call(data)] | 0;
        }
        function copyArray(out, inp) {
            for (var i = 0; i < inp.length; ++i) {
                out[i] = inp[i];
            }
        }
        function transpose(result, data, shapeX, shapeY, strideX, strideY, offset) {
            var ptr = 0;
            for (var i = 0; i < shapeX; ++i) {
                for (var j = 0; j < shapeY; ++j) {
                    result[ptr++] = data[strideX * i + strideY * j + offset];
                }
            }
        }
        function wrapBufferState(gl, stats, config, destroyBuffer) {
            var bufferCount = 0;
            var bufferSet = {};
            function REGLBuffer(type) {
                this.id = bufferCount++;
                this.buffer = gl.createBuffer();
                this.type = type;
                this.usage = GL_STATIC_DRAW;
                this.byteLength = 0;
                this.dimension = 1;
                this.dtype = GL_UNSIGNED_BYTE$3;
                this.persistentData = null;
                if (config.profile) {
                    this.stats = { size: 0 };
                }
            }
            REGLBuffer.prototype.bind = function () {
                gl.bindBuffer(this.type, this.buffer);
            };
            REGLBuffer.prototype.destroy = function () {
                destroy(this);
            };
            var streamPool = [];
            function createStream(type, data) {
                var buffer = streamPool.pop();
                if (!buffer) {
                    buffer = new REGLBuffer(type);
                }
                buffer.bind();
                initBufferFromData(buffer, data, GL_STREAM_DRAW, 0, 1, false);
                return buffer;
            }
            function destroyStream(stream$$1) {
                streamPool.push(stream$$1);
            }
            function initBufferFromTypedArray(buffer, data, usage) {
                buffer.byteLength = data.byteLength;
                gl.bufferData(buffer.type, data, usage);
            }
            function initBufferFromData(buffer, data, usage, dtype, dimension, persist) {
                var shape;
                buffer.usage = usage;
                if (Array.isArray(data)) {
                    buffer.dtype = dtype || GL_FLOAT$3;
                    if (data.length > 0) {
                        var flatData;
                        if (Array.isArray(data[0])) {
                            shape = arrayShape(data);
                            var dim = 1;
                            for (var i = 1; i < shape.length; ++i) {
                                dim *= shape[i];
                            }
                            buffer.dimension = dim;
                            flatData = arrayFlatten(data, shape, buffer.dtype);
                            initBufferFromTypedArray(buffer, flatData, usage);
                            if (persist) {
                                buffer.persistentData = flatData;
                            }
                            else {
                                pool.freeType(flatData);
                            }
                        }
                        else if (typeof data[0] === 'number') {
                            buffer.dimension = dimension;
                            var typedData = pool.allocType(buffer.dtype, data.length);
                            copyArray(typedData, data);
                            initBufferFromTypedArray(buffer, typedData, usage);
                            if (persist) {
                                buffer.persistentData = typedData;
                            }
                            else {
                                pool.freeType(typedData);
                            }
                        }
                        else if (isTypedArray(data[0])) {
                            buffer.dimension = data[0].length;
                            buffer.dtype = dtype || typedArrayCode(data[0]) || GL_FLOAT$3;
                            flatData = arrayFlatten(data, [data.length, data[0].length], buffer.dtype);
                            initBufferFromTypedArray(buffer, flatData, usage);
                            if (persist) {
                                buffer.persistentData = flatData;
                            }
                            else {
                                pool.freeType(flatData);
                            }
                        }
                        else {
                            check$1.raise('invalid buffer data');
                        }
                    }
                }
                else if (isTypedArray(data)) {
                    buffer.dtype = dtype || typedArrayCode(data);
                    buffer.dimension = dimension;
                    initBufferFromTypedArray(buffer, data, usage);
                    if (persist) {
                        buffer.persistentData = new Uint8Array(new Uint8Array(data.buffer));
                    }
                }
                else if (isNDArrayLike(data)) {
                    shape = data.shape;
                    var stride = data.stride;
                    var offset = data.offset;
                    var shapeX = 0;
                    var shapeY = 0;
                    var strideX = 0;
                    var strideY = 0;
                    if (shape.length === 1) {
                        shapeX = shape[0];
                        shapeY = 1;
                        strideX = stride[0];
                        strideY = 0;
                    }
                    else if (shape.length === 2) {
                        shapeX = shape[0];
                        shapeY = shape[1];
                        strideX = stride[0];
                        strideY = stride[1];
                    }
                    else {
                        check$1.raise('invalid shape');
                    }
                    buffer.dtype = dtype || typedArrayCode(data.data) || GL_FLOAT$3;
                    buffer.dimension = shapeY;
                    var transposeData = pool.allocType(buffer.dtype, shapeX * shapeY);
                    transpose(transposeData, data.data, shapeX, shapeY, strideX, strideY, offset);
                    initBufferFromTypedArray(buffer, transposeData, usage);
                    if (persist) {
                        buffer.persistentData = transposeData;
                    }
                    else {
                        pool.freeType(transposeData);
                    }
                }
                else if (data instanceof ArrayBuffer) {
                    buffer.dtype = GL_UNSIGNED_BYTE$3;
                    buffer.dimension = dimension;
                    initBufferFromTypedArray(buffer, data, usage);
                    if (persist) {
                        buffer.persistentData = new Uint8Array(new Uint8Array(data));
                    }
                }
                else {
                    check$1.raise('invalid buffer data');
                }
            }
            function destroy(buffer) {
                stats.bufferCount--;
                // remove attribute link
                destroyBuffer(buffer);
                var handle = buffer.buffer;
                check$1(handle, 'buffer must not be deleted already');
                gl.deleteBuffer(handle);
                buffer.buffer = null;
                delete bufferSet[buffer.id];
            }
            function createBuffer(options, type, deferInit, persistent) {
                stats.bufferCount++;
                var buffer = new REGLBuffer(type);
                bufferSet[buffer.id] = buffer;
                function reglBuffer(options) {
                    var usage = GL_STATIC_DRAW;
                    var data = null;
                    var byteLength = 0;
                    var dtype = 0;
                    var dimension = 1;
                    if (Array.isArray(options) ||
                        isTypedArray(options) ||
                        isNDArrayLike(options) ||
                        options instanceof ArrayBuffer) {
                        data = options;
                    }
                    else if (typeof options === 'number') {
                        byteLength = options | 0;
                    }
                    else if (options) {
                        check$1.type(options, 'object', 'buffer arguments must be an object, a number or an array');
                        if ('data' in options) {
                            check$1(data === null ||
                                Array.isArray(data) ||
                                isTypedArray(data) ||
                                isNDArrayLike(data), 'invalid data for buffer');
                            data = options.data;
                        }
                        if ('usage' in options) {
                            check$1.parameter(options.usage, usageTypes, 'invalid buffer usage');
                            usage = usageTypes[options.usage];
                        }
                        if ('type' in options) {
                            check$1.parameter(options.type, glTypes, 'invalid buffer type');
                            dtype = glTypes[options.type];
                        }
                        if ('dimension' in options) {
                            check$1.type(options.dimension, 'number', 'invalid dimension');
                            dimension = options.dimension | 0;
                        }
                        if ('length' in options) {
                            check$1.nni(byteLength, 'buffer length must be a nonnegative integer');
                            byteLength = options.length | 0;
                        }
                    }
                    buffer.bind();
                    if (!data) {
                        // #475
                        if (byteLength)
                            gl.bufferData(buffer.type, byteLength, usage);
                        buffer.dtype = dtype || GL_UNSIGNED_BYTE$3;
                        buffer.usage = usage;
                        buffer.dimension = dimension;
                        buffer.byteLength = byteLength;
                    }
                    else {
                        initBufferFromData(buffer, data, usage, dtype, dimension, persistent);
                    }
                    if (config.profile) {
                        buffer.stats.size = buffer.byteLength * DTYPES_SIZES[buffer.dtype];
                    }
                    return reglBuffer;
                }
                function setSubData(data, offset) {
                    check$1(offset + data.byteLength <= buffer.byteLength, 'invalid buffer subdata call, buffer is too small. ' + ' Can\'t write data of size ' + data.byteLength + ' starting from offset ' + offset + ' to a buffer of size ' + buffer.byteLength);
                    gl.bufferSubData(buffer.type, offset, data);
                }
                function subdata(data, offset_) {
                    var offset = (offset_ || 0) | 0;
                    var shape;
                    buffer.bind();
                    if (isTypedArray(data) || data instanceof ArrayBuffer) {
                        setSubData(data, offset);
                    }
                    else if (Array.isArray(data)) {
                        if (data.length > 0) {
                            if (typeof data[0] === 'number') {
                                var converted = pool.allocType(buffer.dtype, data.length);
                                copyArray(converted, data);
                                setSubData(converted, offset);
                                pool.freeType(converted);
                            }
                            else if (Array.isArray(data[0]) || isTypedArray(data[0])) {
                                shape = arrayShape(data);
                                var flatData = arrayFlatten(data, shape, buffer.dtype);
                                setSubData(flatData, offset);
                                pool.freeType(flatData);
                            }
                            else {
                                check$1.raise('invalid buffer data');
                            }
                        }
                    }
                    else if (isNDArrayLike(data)) {
                        shape = data.shape;
                        var stride = data.stride;
                        var shapeX = 0;
                        var shapeY = 0;
                        var strideX = 0;
                        var strideY = 0;
                        if (shape.length === 1) {
                            shapeX = shape[0];
                            shapeY = 1;
                            strideX = stride[0];
                            strideY = 0;
                        }
                        else if (shape.length === 2) {
                            shapeX = shape[0];
                            shapeY = shape[1];
                            strideX = stride[0];
                            strideY = stride[1];
                        }
                        else {
                            check$1.raise('invalid shape');
                        }
                        var dtype = Array.isArray(data.data)
                            ? buffer.dtype
                            : typedArrayCode(data.data);
                        var transposeData = pool.allocType(dtype, shapeX * shapeY);
                        transpose(transposeData, data.data, shapeX, shapeY, strideX, strideY, data.offset);
                        setSubData(transposeData, offset);
                        pool.freeType(transposeData);
                    }
                    else {
                        check$1.raise('invalid data for buffer subdata');
                    }
                    return reglBuffer;
                }
                if (!deferInit) {
                    reglBuffer(options);
                }
                reglBuffer._reglType = 'buffer';
                reglBuffer._buffer = buffer;
                reglBuffer.subdata = subdata;
                if (config.profile) {
                    reglBuffer.stats = buffer.stats;
                }
                reglBuffer.destroy = function () { destroy(buffer); };
                return reglBuffer;
            }
            function restoreBuffers() {
                values(bufferSet).forEach(function (buffer) {
                    buffer.buffer = gl.createBuffer();
                    gl.bindBuffer(buffer.type, buffer.buffer);
                    gl.bufferData(buffer.type, buffer.persistentData || buffer.byteLength, buffer.usage);
                });
            }
            if (config.profile) {
                stats.getTotalBufferSize = function () {
                    var total = 0;
                    // TODO: Right now, the streams are not part of the total count.
                    Object.keys(bufferSet).forEach(function (key) {
                        total += bufferSet[key].stats.size;
                    });
                    return total;
                };
            }
            return {
                create: createBuffer,
                createStream: createStream,
                destroyStream: destroyStream,
                clear: function () {
                    values(bufferSet).forEach(destroy);
                    streamPool.forEach(destroy);
                },
                getBuffer: function (wrapper) {
                    if (wrapper && wrapper._buffer instanceof REGLBuffer) {
                        return wrapper._buffer;
                    }
                    return null;
                },
                restore: restoreBuffers,
                _initBuffer: initBufferFromData
            };
        }
        var points = 0;
        var point = 0;
        var lines = 1;
        var line = 1;
        var triangles = 4;
        var triangle = 4;
        var primTypes = {
            points: points,
            point: point,
            lines: lines,
            line: line,
            triangles: triangles,
            triangle: triangle,
            "line loop": 2,
            "line strip": 3,
            "triangle strip": 5,
            "triangle fan": 6
        };
        var GL_POINTS = 0;
        var GL_LINES = 1;
        var GL_TRIANGLES = 4;
        var GL_BYTE$2 = 5120;
        var GL_UNSIGNED_BYTE$4 = 5121;
        var GL_SHORT$2 = 5122;
        var GL_UNSIGNED_SHORT$2 = 5123;
        var GL_INT$2 = 5124;
        var GL_UNSIGNED_INT$2 = 5125;
        var GL_ELEMENT_ARRAY_BUFFER = 34963;
        var GL_STREAM_DRAW$1 = 0x88E0;
        var GL_STATIC_DRAW$1 = 0x88E4;
        function wrapElementsState(gl, extensions, bufferState, stats) {
            var elementSet = {};
            var elementCount = 0;
            var elementTypes = {
                'uint8': GL_UNSIGNED_BYTE$4,
                'uint16': GL_UNSIGNED_SHORT$2
            };
            if (extensions.oes_element_index_uint) {
                elementTypes.uint32 = GL_UNSIGNED_INT$2;
            }
            function REGLElementBuffer(buffer) {
                this.id = elementCount++;
                elementSet[this.id] = this;
                this.buffer = buffer;
                this.primType = GL_TRIANGLES;
                this.vertCount = 0;
                this.type = 0;
            }
            REGLElementBuffer.prototype.bind = function () {
                this.buffer.bind();
            };
            var bufferPool = [];
            function createElementStream(data) {
                var result = bufferPool.pop();
                if (!result) {
                    result = new REGLElementBuffer(bufferState.create(null, GL_ELEMENT_ARRAY_BUFFER, true, false)._buffer);
                }
                initElements(result, data, GL_STREAM_DRAW$1, -1, -1, 0, 0);
                return result;
            }
            function destroyElementStream(elements) {
                bufferPool.push(elements);
            }
            function initElements(elements, data, usage, prim, count, byteLength, type) {
                elements.buffer.bind();
                var dtype;
                if (data) {
                    var predictedType = type;
                    if (!type && (!isTypedArray(data) ||
                        (isNDArrayLike(data) && !isTypedArray(data.data)))) {
                        predictedType = extensions.oes_element_index_uint
                            ? GL_UNSIGNED_INT$2
                            : GL_UNSIGNED_SHORT$2;
                    }
                    bufferState._initBuffer(elements.buffer, data, usage, predictedType, 3);
                }
                else {
                    gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, byteLength, usage);
                    elements.buffer.dtype = dtype || GL_UNSIGNED_BYTE$4;
                    elements.buffer.usage = usage;
                    elements.buffer.dimension = 3;
                    elements.buffer.byteLength = byteLength;
                }
                dtype = type;
                if (!type) {
                    switch (elements.buffer.dtype) {
                        case GL_UNSIGNED_BYTE$4:
                        case GL_BYTE$2:
                            dtype = GL_UNSIGNED_BYTE$4;
                            break;
                        case GL_UNSIGNED_SHORT$2:
                        case GL_SHORT$2:
                            dtype = GL_UNSIGNED_SHORT$2;
                            break;
                        case GL_UNSIGNED_INT$2:
                        case GL_INT$2:
                            dtype = GL_UNSIGNED_INT$2;
                            break;
                        default:
                            check$1.raise('unsupported type for element array');
                    }
                    elements.buffer.dtype = dtype;
                }
                elements.type = dtype;
                // Check oes_element_index_uint extension
                check$1(dtype !== GL_UNSIGNED_INT$2 ||
                    !!extensions.oes_element_index_uint, '32 bit element buffers not supported, enable oes_element_index_uint first');
                // try to guess default primitive type and arguments
                var vertCount = count;
                if (vertCount < 0) {
                    vertCount = elements.buffer.byteLength;
                    if (dtype === GL_UNSIGNED_SHORT$2) {
                        vertCount >>= 1;
                    }
                    else if (dtype === GL_UNSIGNED_INT$2) {
                        vertCount >>= 2;
                    }
                }
                elements.vertCount = vertCount;
                // try to guess primitive type from cell dimension
                var primType = prim;
                if (prim < 0) {
                    primType = GL_TRIANGLES;
                    var dimension = elements.buffer.dimension;
                    if (dimension === 1)
                        primType = GL_POINTS;
                    if (dimension === 2)
                        primType = GL_LINES;
                    if (dimension === 3)
                        primType = GL_TRIANGLES;
                }
                elements.primType = primType;
            }
            function destroyElements(elements) {
                stats.elementsCount--;
                check$1(elements.buffer !== null, 'must not double destroy elements');
                delete elementSet[elements.id];
                elements.buffer.destroy();
                elements.buffer = null;
            }
            function createElements(options, persistent) {
                var buffer = bufferState.create(null, GL_ELEMENT_ARRAY_BUFFER, true);
                var elements = new REGLElementBuffer(buffer._buffer);
                stats.elementsCount++;
                function reglElements(options) {
                    if (!options) {
                        buffer();
                        elements.primType = GL_TRIANGLES;
                        elements.vertCount = 0;
                        elements.type = GL_UNSIGNED_BYTE$4;
                    }
                    else if (typeof options === 'number') {
                        buffer(options);
                        elements.primType = GL_TRIANGLES;
                        elements.vertCount = options | 0;
                        elements.type = GL_UNSIGNED_BYTE$4;
                    }
                    else {
                        var data = null;
                        var usage = GL_STATIC_DRAW$1;
                        var primType = -1;
                        var vertCount = -1;
                        var byteLength = 0;
                        var dtype = 0;
                        if (Array.isArray(options) ||
                            isTypedArray(options) ||
                            isNDArrayLike(options)) {
                            data = options;
                        }
                        else {
                            check$1.type(options, 'object', 'invalid arguments for elements');
                            if ('data' in options) {
                                data = options.data;
                                check$1(Array.isArray(data) ||
                                    isTypedArray(data) ||
                                    isNDArrayLike(data), 'invalid data for element buffer');
                            }
                            if ('usage' in options) {
                                check$1.parameter(options.usage, usageTypes, 'invalid element buffer usage');
                                usage = usageTypes[options.usage];
                            }
                            if ('primitive' in options) {
                                check$1.parameter(options.primitive, primTypes, 'invalid element buffer primitive');
                                primType = primTypes[options.primitive];
                            }
                            if ('count' in options) {
                                check$1(typeof options.count === 'number' && options.count >= 0, 'invalid vertex count for elements');
                                vertCount = options.count | 0;
                            }
                            if ('type' in options) {
                                check$1.parameter(options.type, elementTypes, 'invalid buffer type');
                                dtype = elementTypes[options.type];
                            }
                            if ('length' in options) {
                                byteLength = options.length | 0;
                            }
                            else {
                                byteLength = vertCount;
                                if (dtype === GL_UNSIGNED_SHORT$2 || dtype === GL_SHORT$2) {
                                    byteLength *= 2;
                                }
                                else if (dtype === GL_UNSIGNED_INT$2 || dtype === GL_INT$2) {
                                    byteLength *= 4;
                                }
                            }
                        }
                        initElements(elements, data, usage, primType, vertCount, byteLength, dtype);
                    }
                    return reglElements;
                }
                reglElements(options);
                reglElements._reglType = 'elements';
                reglElements._elements = elements;
                reglElements.subdata = function (data, offset) {
                    buffer.subdata(data, offset);
                    return reglElements;
                };
                reglElements.destroy = function () {
                    destroyElements(elements);
                };
                return reglElements;
            }
            return {
                create: createElements,
                createStream: createElementStream,
                destroyStream: destroyElementStream,
                getElements: function (elements) {
                    if (typeof elements === 'function' &&
                        elements._elements instanceof REGLElementBuffer) {
                        return elements._elements;
                    }
                    return null;
                },
                clear: function () {
                    values(elementSet).forEach(destroyElements);
                }
            };
        }
        var FLOAT = new Float32Array(1);
        var INT = new Uint32Array(FLOAT.buffer);
        var GL_UNSIGNED_SHORT$4 = 5123;
        function convertToHalfFloat(array) {
            var ushorts = pool.allocType(GL_UNSIGNED_SHORT$4, array.length);
            for (var i = 0; i < array.length; ++i) {
                if (isNaN(array[i])) {
                    ushorts[i] = 0xffff;
                }
                else if (array[i] === Infinity) {
                    ushorts[i] = 0x7c00;
                }
                else if (array[i] === -Infinity) {
                    ushorts[i] = 0xfc00;
                }
                else {
                    FLOAT[0] = array[i];
                    var x = INT[0];
                    var sgn = (x >>> 31) << 15;
                    var exp = ((x << 1) >>> 24) - 127;
                    var frac = (x >> 13) & ((1 << 10) - 1);
                    if (exp < -24) {
                        // round non-representable denormals to 0
                        ushorts[i] = sgn;
                    }
                    else if (exp < -14) {
                        // handle denormals
                        var s = -14 - exp;
                        ushorts[i] = sgn + ((frac + (1 << 10)) >> s);
                    }
                    else if (exp > 15) {
                        // round overflow to +/- Infinity
                        ushorts[i] = sgn + 0x7c00;
                    }
                    else {
                        // otherwise convert directly
                        ushorts[i] = sgn + ((exp + 15) << 10) + frac;
                    }
                }
            }
            return ushorts;
        }
        function isArrayLike(s) {
            return Array.isArray(s) || isTypedArray(s);
        }
        var isPow2$1 = function (v) {
            return !(v & (v - 1)) && (!!v);
        };
        var GL_COMPRESSED_TEXTURE_FORMATS = 0x86A3;
        var GL_TEXTURE_2D$1 = 0x0DE1;
        var GL_TEXTURE_CUBE_MAP$1 = 0x8513;
        var GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 = 0x8515;
        var GL_RGBA$1 = 0x1908;
        var GL_ALPHA = 0x1906;
        var GL_RGB = 0x1907;
        var GL_LUMINANCE = 0x1909;
        var GL_LUMINANCE_ALPHA = 0x190A;
        var GL_RGBA4 = 0x8056;
        var GL_RGB5_A1 = 0x8057;
        var GL_RGB565 = 0x8D62;
        var GL_UNSIGNED_SHORT_4_4_4_4$1 = 0x8033;
        var GL_UNSIGNED_SHORT_5_5_5_1$1 = 0x8034;
        var GL_UNSIGNED_SHORT_5_6_5$1 = 0x8363;
        var GL_UNSIGNED_INT_24_8_WEBGL$1 = 0x84FA;
        var GL_DEPTH_COMPONENT = 0x1902;
        var GL_DEPTH_STENCIL = 0x84F9;
        var GL_SRGB_EXT = 0x8C40;
        var GL_SRGB_ALPHA_EXT = 0x8C42;
        var GL_HALF_FLOAT_OES$1 = 0x8D61;
        var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;
        var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;
        var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;
        var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;
        var GL_COMPRESSED_RGB_ATC_WEBGL = 0x8C92;
        var GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 0x8C93;
        var GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 0x87EE;
        var GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
        var GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
        var GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
        var GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;
        var GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64;
        var GL_UNSIGNED_BYTE$5 = 0x1401;
        var GL_UNSIGNED_SHORT$3 = 0x1403;
        var GL_UNSIGNED_INT$3 = 0x1405;
        var GL_FLOAT$4 = 0x1406;
        var GL_TEXTURE_WRAP_S = 0x2802;
        var GL_TEXTURE_WRAP_T = 0x2803;
        var GL_REPEAT = 0x2901;
        var GL_CLAMP_TO_EDGE$1 = 0x812F;
        var GL_MIRRORED_REPEAT = 0x8370;
        var GL_TEXTURE_MAG_FILTER = 0x2800;
        var GL_TEXTURE_MIN_FILTER = 0x2801;
        var GL_NEAREST$1 = 0x2600;
        var GL_LINEAR = 0x2601;
        var GL_NEAREST_MIPMAP_NEAREST$1 = 0x2700;
        var GL_LINEAR_MIPMAP_NEAREST$1 = 0x2701;
        var GL_NEAREST_MIPMAP_LINEAR$1 = 0x2702;
        var GL_LINEAR_MIPMAP_LINEAR$1 = 0x2703;
        var GL_GENERATE_MIPMAP_HINT = 0x8192;
        var GL_DONT_CARE = 0x1100;
        var GL_FASTEST = 0x1101;
        var GL_NICEST = 0x1102;
        var GL_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FE;
        var GL_UNPACK_ALIGNMENT = 0x0CF5;
        var GL_UNPACK_FLIP_Y_WEBGL = 0x9240;
        var GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
        var GL_UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;
        var GL_BROWSER_DEFAULT_WEBGL = 0x9244;
        var GL_TEXTURE0$1 = 0x84C0;
        var MIPMAP_FILTERS = [
            GL_NEAREST_MIPMAP_NEAREST$1,
            GL_NEAREST_MIPMAP_LINEAR$1,
            GL_LINEAR_MIPMAP_NEAREST$1,
            GL_LINEAR_MIPMAP_LINEAR$1
        ];
        var CHANNELS_FORMAT = [
            0,
            GL_LUMINANCE,
            GL_LUMINANCE_ALPHA,
            GL_RGB,
            GL_RGBA$1
        ];
        var FORMAT_CHANNELS = {};
        FORMAT_CHANNELS[GL_LUMINANCE] =
            FORMAT_CHANNELS[GL_ALPHA] =
                FORMAT_CHANNELS[GL_DEPTH_COMPONENT] = 1;
        FORMAT_CHANNELS[GL_DEPTH_STENCIL] =
            FORMAT_CHANNELS[GL_LUMINANCE_ALPHA] = 2;
        FORMAT_CHANNELS[GL_RGB] =
            FORMAT_CHANNELS[GL_SRGB_EXT] = 3;
        FORMAT_CHANNELS[GL_RGBA$1] =
            FORMAT_CHANNELS[GL_SRGB_ALPHA_EXT] = 4;
        function objectName(str) {
            return '[object ' + str + ']';
        }
        var CANVAS_CLASS = objectName('HTMLCanvasElement');
        var OFFSCREENCANVAS_CLASS = objectName('OffscreenCanvas');
        var CONTEXT2D_CLASS = objectName('CanvasRenderingContext2D');
        var BITMAP_CLASS = objectName('ImageBitmap');
        var IMAGE_CLASS = objectName('HTMLImageElement');
        var VIDEO_CLASS = objectName('HTMLVideoElement');
        var PIXEL_CLASSES = Object.keys(arrayTypes).concat([
            CANVAS_CLASS,
            OFFSCREENCANVAS_CLASS,
            CONTEXT2D_CLASS,
            BITMAP_CLASS,
            IMAGE_CLASS,
            VIDEO_CLASS
        ]);
        // for every texture type, store
        // the size in bytes.
        var TYPE_SIZES = [];
        TYPE_SIZES[GL_UNSIGNED_BYTE$5] = 1;
        TYPE_SIZES[GL_FLOAT$4] = 4;
        TYPE_SIZES[GL_HALF_FLOAT_OES$1] = 2;
        TYPE_SIZES[GL_UNSIGNED_SHORT$3] = 2;
        TYPE_SIZES[GL_UNSIGNED_INT$3] = 4;
        var FORMAT_SIZES_SPECIAL = [];
        FORMAT_SIZES_SPECIAL[GL_RGBA4] = 2;
        FORMAT_SIZES_SPECIAL[GL_RGB5_A1] = 2;
        FORMAT_SIZES_SPECIAL[GL_RGB565] = 2;
        FORMAT_SIZES_SPECIAL[GL_DEPTH_STENCIL] = 4;
        FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5;
        FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5;
        FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1;
        FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1;
        FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ATC_WEBGL] = 0.5;
        FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1;
        FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1;
        FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5;
        FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25;
        FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5;
        FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25;
        FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ETC1_WEBGL] = 0.5;
        function isNumericArray(arr) {
            return (Array.isArray(arr) &&
                (arr.length === 0 ||
                    typeof arr[0] === 'number'));
        }
        function isRectArray(arr) {
            if (!Array.isArray(arr)) {
                return false;
            }
            var width = arr.length;
            if (width === 0 || !isArrayLike(arr[0])) {
                return false;
            }
            return true;
        }
        function classString(x) {
            return Object.prototype.toString.call(x);
        }
        function isCanvasElement(object) {
            return classString(object) === CANVAS_CLASS;
        }
        function isOffscreenCanvas(object) {
            return classString(object) === OFFSCREENCANVAS_CLASS;
        }
        function isContext2D(object) {
            return classString(object) === CONTEXT2D_CLASS;
        }
        function isBitmap(object) {
            return classString(object) === BITMAP_CLASS;
        }
        function isImageElement(object) {
            return classString(object) === IMAGE_CLASS;
        }
        function isVideoElement(object) {
            return classString(object) === VIDEO_CLASS;
        }
        function isPixelData(object) {
            if (!object) {
                return false;
            }
            var className = classString(object);
            if (PIXEL_CLASSES.indexOf(className) >= 0) {
                return true;
            }
            return (isNumericArray(object) ||
                isRectArray(object) ||
                isNDArrayLike(object));
        }
        function typedArrayCode$1(data) {
            return arrayTypes[Object.prototype.toString.call(data)] | 0;
        }
        function convertData(result, data) {
            var n = data.length;
            switch (result.type) {
                case GL_UNSIGNED_BYTE$5:
                case GL_UNSIGNED_SHORT$3:
                case GL_UNSIGNED_INT$3:
                case GL_FLOAT$4:
                    var converted = pool.allocType(result.type, n);
                    converted.set(data);
                    result.data = converted;
                    break;
                case GL_HALF_FLOAT_OES$1:
                    result.data = convertToHalfFloat(data);
                    break;
                default:
                    check$1.raise('unsupported texture type, must specify a typed array');
            }
        }
        function preConvert(image, n) {
            return pool.allocType(image.type === GL_HALF_FLOAT_OES$1
                ? GL_FLOAT$4
                : image.type, n);
        }
        function postConvert(image, data) {
            if (image.type === GL_HALF_FLOAT_OES$1) {
                image.data = convertToHalfFloat(data);
                pool.freeType(data);
            }
            else {
                image.data = data;
            }
        }
        function transposeData(image, array, strideX, strideY, strideC, offset) {
            var w = image.width;
            var h = image.height;
            var c = image.channels;
            var n = w * h * c;
            var data = preConvert(image, n);
            var p = 0;
            for (var i = 0; i < h; ++i) {
                for (var j = 0; j < w; ++j) {
                    for (var k = 0; k < c; ++k) {
                        data[p++] = array[strideX * j + strideY * i + strideC * k + offset];
                    }
                }
            }
            postConvert(image, data);
        }
        function getTextureSize(format, type, width, height, isMipmap, isCube) {
            var s;
            if (typeof FORMAT_SIZES_SPECIAL[format] !== 'undefined') {
                // we have a special array for dealing with weird color formats such as RGB5A1
                s = FORMAT_SIZES_SPECIAL[format];
            }
            else {
                s = FORMAT_CHANNELS[format] * TYPE_SIZES[type];
            }
            if (isCube) {
                s *= 6;
            }
            if (isMipmap) {
                // compute the total size of all the mipmaps.
                var total = 0;
                var w = width;
                while (w >= 1) {
                    // we can only use mipmaps on a square image,
                    // so we can simply use the width and ignore the height:
                    total += s * w * w;
                    w /= 2;
                }
                return total;
            }
            else {
                return s * width * height;
            }
        }
        function createTextureSet(gl, extensions, limits, reglPoll, contextState, stats, config) {
            // -------------------------------------------------------
            // Initialize constants and parameter tables here
            // -------------------------------------------------------
            var mipmapHint = {
                "don't care": GL_DONT_CARE,
                'dont care': GL_DONT_CARE,
                'nice': GL_NICEST,
                'fast': GL_FASTEST
            };
            var wrapModes = {
                'repeat': GL_REPEAT,
                'clamp': GL_CLAMP_TO_EDGE$1,
                'mirror': GL_MIRRORED_REPEAT
            };
            var magFilters = {
                'nearest': GL_NEAREST$1,
                'linear': GL_LINEAR
            };
            var minFilters = extend({
                'mipmap': GL_LINEAR_MIPMAP_LINEAR$1,
                'nearest mipmap nearest': GL_NEAREST_MIPMAP_NEAREST$1,
                'linear mipmap nearest': GL_LINEAR_MIPMAP_NEAREST$1,
                'nearest mipmap linear': GL_NEAREST_MIPMAP_LINEAR$1,
                'linear mipmap linear': GL_LINEAR_MIPMAP_LINEAR$1
            }, magFilters);
            var colorSpace = {
                'none': 0,
                'browser': GL_BROWSER_DEFAULT_WEBGL
            };
            var textureTypes = {
                'uint8': GL_UNSIGNED_BYTE$5,
                'rgba4': GL_UNSIGNED_SHORT_4_4_4_4$1,
                'rgb565': GL_UNSIGNED_SHORT_5_6_5$1,
                'rgb5 a1': GL_UNSIGNED_SHORT_5_5_5_1$1
            };
            var textureFormats = {
                'alpha': GL_ALPHA,
                'luminance': GL_LUMINANCE,
                'luminance alpha': GL_LUMINANCE_ALPHA,
                'rgb': GL_RGB,
                'rgba': GL_RGBA$1,
                'rgba4': GL_RGBA4,
                'rgb5 a1': GL_RGB5_A1,
                'rgb565': GL_RGB565
            };
            var compressedTextureFormats = {};
            if (extensions.ext_srgb) {
                textureFormats.srgb = GL_SRGB_EXT;
                textureFormats.srgba = GL_SRGB_ALPHA_EXT;
            }
            if (extensions.oes_texture_float) {
                textureTypes.float32 = textureTypes.float = GL_FLOAT$4;
            }
            if (extensions.oes_texture_half_float) {
                textureTypes['float16'] = textureTypes['half float'] = GL_HALF_FLOAT_OES$1;
            }
            if (extensions.webgl_depth_texture) {
                extend(textureFormats, {
                    'depth': GL_DEPTH_COMPONENT,
                    'depth stencil': GL_DEPTH_STENCIL
                });
                extend(textureTypes, {
                    'uint16': GL_UNSIGNED_SHORT$3,
                    'uint32': GL_UNSIGNED_INT$3,
                    'depth stencil': GL_UNSIGNED_INT_24_8_WEBGL$1
                });
            }
            if (extensions.webgl_compressed_texture_s3tc) {
                extend(compressedTextureFormats, {
                    'rgb s3tc dxt1': GL_COMPRESSED_RGB_S3TC_DXT1_EXT,
                    'rgba s3tc dxt1': GL_COMPRESSED_RGBA_S3TC_DXT1_EXT,
                    'rgba s3tc dxt3': GL_COMPRESSED_RGBA_S3TC_DXT3_EXT,
                    'rgba s3tc dxt5': GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
                });
            }
            if (extensions.webgl_compressed_texture_atc) {
                extend(compressedTextureFormats, {
                    'rgb atc': GL_COMPRESSED_RGB_ATC_WEBGL,
                    'rgba atc explicit alpha': GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL,
                    'rgba atc interpolated alpha': GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL
                });
            }
            if (extensions.webgl_compressed_texture_pvrtc) {
                extend(compressedTextureFormats, {
                    'rgb pvrtc 4bppv1': GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
                    'rgb pvrtc 2bppv1': GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
                    'rgba pvrtc 4bppv1': GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
                    'rgba pvrtc 2bppv1': GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
                });
            }
            if (extensions.webgl_compressed_texture_etc1) {
                compressedTextureFormats['rgb etc1'] = GL_COMPRESSED_RGB_ETC1_WEBGL;
            }
            // Copy over all texture formats
            var supportedCompressedFormats = Array.prototype.slice.call(gl.getParameter(GL_COMPRESSED_TEXTURE_FORMATS));
            Object.keys(compressedTextureFormats).forEach(function (name) {
                var format = compressedTextureFormats[name];
                if (supportedCompressedFormats.indexOf(format) >= 0) {
                    textureFormats[name] = format;
                }
            });
            var supportedFormats = Object.keys(textureFormats);
            limits.textureFormats = supportedFormats;
            // associate with every format string its
            // corresponding GL-value.
            var textureFormatsInvert = [];
            Object.keys(textureFormats).forEach(function (key) {
                var val = textureFormats[key];
                textureFormatsInvert[val] = key;
            });
            // associate with every type string its
            // corresponding GL-value.
            var textureTypesInvert = [];
            Object.keys(textureTypes).forEach(function (key) {
                var val = textureTypes[key];
                textureTypesInvert[val] = key;
            });
            var magFiltersInvert = [];
            Object.keys(magFilters).forEach(function (key) {
                var val = magFilters[key];
                magFiltersInvert[val] = key;
            });
            var minFiltersInvert = [];
            Object.keys(minFilters).forEach(function (key) {
                var val = minFilters[key];
                minFiltersInvert[val] = key;
            });
            var wrapModesInvert = [];
            Object.keys(wrapModes).forEach(function (key) {
                var val = wrapModes[key];
                wrapModesInvert[val] = key;
            });
            // colorFormats[] gives the format (channels) associated to an
            // internalformat
            var colorFormats = supportedFormats.reduce(function (color, key) {
                var glenum = textureFormats[key];
                if (glenum === GL_LUMINANCE ||
                    glenum === GL_ALPHA ||
                    glenum === GL_LUMINANCE ||
                    glenum === GL_LUMINANCE_ALPHA ||
                    glenum === GL_DEPTH_COMPONENT ||
                    glenum === GL_DEPTH_STENCIL ||
                    (extensions.ext_srgb &&
                        (glenum === GL_SRGB_EXT ||
                            glenum === GL_SRGB_ALPHA_EXT))) {
                    color[glenum] = glenum;
                }
                else if (glenum === GL_RGB5_A1 || key.indexOf('rgba') >= 0) {
                    color[glenum] = GL_RGBA$1;
                }
                else {
                    color[glenum] = GL_RGB;
                }
                return color;
            }, {});
            function TexFlags() {
                // format info
                this.internalformat = GL_RGBA$1;
                this.format = GL_RGBA$1;
                this.type = GL_UNSIGNED_BYTE$5;
                this.compressed = false;
                // pixel storage
                this.premultiplyAlpha = false;
                this.flipY = false;
                this.unpackAlignment = 1;
                this.colorSpace = GL_BROWSER_DEFAULT_WEBGL;
                // shape info
                this.width = 0;
                this.height = 0;
                this.channels = 0;
            }
            function copyFlags(result, other) {
                result.internalformat = other.internalformat;
                result.format = other.format;
                result.type = other.type;
                result.compressed = other.compressed;
                result.premultiplyAlpha = other.premultiplyAlpha;
                result.flipY = other.flipY;
                result.unpackAlignment = other.unpackAlignment;
                result.colorSpace = other.colorSpace;
                result.width = other.width;
                result.height = other.height;
                result.channels = other.channels;
            }
            function parseFlags(flags, options) {
                if (typeof options !== 'object' || !options) {
                    return;
                }
                if ('premultiplyAlpha' in options) {
                    check$1.type(options.premultiplyAlpha, 'boolean', 'invalid premultiplyAlpha');
                    flags.premultiplyAlpha = options.premultiplyAlpha;
                }
                if ('flipY' in options) {
                    check$1.type(options.flipY, 'boolean', 'invalid texture flip');
                    flags.flipY = options.flipY;
                }
                if ('alignment' in options) {
                    check$1.oneOf(options.alignment, [1, 2, 4, 8], 'invalid texture unpack alignment');
                    flags.unpackAlignment = options.alignment;
                }
                if ('colorSpace' in options) {
                    check$1.parameter(options.colorSpace, colorSpace, 'invalid colorSpace');
                    flags.colorSpace = colorSpace[options.colorSpace];
                }
                if ('type' in options) {
                    var type = options.type;
                    check$1(extensions.oes_texture_float ||
                        !(type === 'float' || type === 'float32'), 'you must enable the OES_texture_float extension in order to use floating point textures.');
                    check$1(extensions.oes_texture_half_float ||
                        !(type === 'half float' || type === 'float16'), 'you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures.');
                    check$1(extensions.webgl_depth_texture ||
                        !(type === 'uint16' || type === 'uint32' || type === 'depth stencil'), 'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
                    check$1.parameter(type, textureTypes, 'invalid texture type');
                    flags.type = textureTypes[type];
                }
                var w = flags.width;
                var h = flags.height;
                var c = flags.channels;
                var hasChannels = false;
                if ('shape' in options) {
                    check$1(Array.isArray(options.shape) && options.shape.length >= 2, 'shape must be an array');
                    w = options.shape[0];
                    h = options.shape[1];
                    if (options.shape.length === 3) {
                        c = options.shape[2];
                        check$1(c > 0 && c <= 4, 'invalid number of channels');
                        hasChannels = true;
                    }
                    check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
                    check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
                }
                else {
                    if ('radius' in options) {
                        w = h = options.radius;
                        check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid radius');
                    }
                    if ('width' in options) {
                        w = options.width;
                        check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
                    }
                    if ('height' in options) {
                        h = options.height;
                        check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
                    }
                    if ('channels' in options) {
                        c = options.channels;
                        check$1(c > 0 && c <= 4, 'invalid number of channels');
                        hasChannels = true;
                    }
                }
                flags.width = w | 0;
                flags.height = h | 0;
                flags.channels = c | 0;
                var hasFormat = false;
                if ('format' in options) {
                    var formatStr = options.format;
                    check$1(extensions.webgl_depth_texture ||
                        !(formatStr === 'depth' || formatStr === 'depth stencil'), 'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
                    check$1.parameter(formatStr, textureFormats, 'invalid texture format');
                    var internalformat = flags.internalformat = textureFormats[formatStr];
                    flags.format = colorFormats[internalformat];
                    if (formatStr in textureTypes) {
                        if (!('type' in options)) {
                            flags.type = textureTypes[formatStr];
                        }
                    }
                    if (formatStr in compressedTextureFormats) {
                        flags.compressed = true;
                    }
                    hasFormat = true;
                }
                // Reconcile channels and format
                if (!hasChannels && hasFormat) {
                    flags.channels = FORMAT_CHANNELS[flags.format];
                }
                else if (hasChannels && !hasFormat) {
                    if (flags.channels !== CHANNELS_FORMAT[flags.format]) {
                        flags.format = flags.internalformat = CHANNELS_FORMAT[flags.channels];
                    }
                }
                else if (hasFormat && hasChannels) {
                    check$1(flags.channels === FORMAT_CHANNELS[flags.format], 'number of channels inconsistent with specified format');
                }
            }
            function setFlags(flags) {
                gl.pixelStorei(GL_UNPACK_FLIP_Y_WEBGL, flags.flipY);
                gl.pixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, flags.premultiplyAlpha);
                gl.pixelStorei(GL_UNPACK_COLORSPACE_CONVERSION_WEBGL, flags.colorSpace);
                gl.pixelStorei(GL_UNPACK_ALIGNMENT, flags.unpackAlignment);
            }
            // -------------------------------------------------------
            // Tex image data
            // -------------------------------------------------------
            function TexImage() {
                TexFlags.call(this);
                this.xOffset = 0;
                this.yOffset = 0;
                // data
                this.data = null;
                this.needsFree = false;
                // html element
                this.element = null;
                // copyTexImage info
                this.needsCopy = false;
            }
            function parseImage(image, options) {
                var data = null;
                if (isPixelData(options)) {
                    data = options;
                }
                else if (options) {
                    check$1.type(options, 'object', 'invalid pixel data type');
                    parseFlags(image, options);
                    if ('x' in options) {
                        image.xOffset = options.x | 0;
                    }
                    if ('y' in options) {
                        image.yOffset = options.y | 0;
                    }
                    if (isPixelData(options.data)) {
                        data = options.data;
                    }
                }
                check$1(!image.compressed ||
                    data instanceof Uint8Array, 'compressed texture data must be stored in a uint8array');
                if (options.copy) {
                    check$1(!data, 'can not specify copy and data field for the same texture');
                    var viewW = contextState.viewportWidth;
                    var viewH = contextState.viewportHeight;
                    image.width = image.width || (viewW - image.xOffset);
                    image.height = image.height || (viewH - image.yOffset);
                    image.needsCopy = true;
                    check$1(image.xOffset >= 0 && image.xOffset < viewW &&
                        image.yOffset >= 0 && image.yOffset < viewH &&
                        image.width > 0 && image.width <= viewW &&
                        image.height > 0 && image.height <= viewH, 'copy texture read out of bounds');
                }
                else if (!data) {
                    image.width = image.width || 1;
                    image.height = image.height || 1;
                    image.channels = image.channels || 4;
                }
                else if (isTypedArray(data)) {
                    image.channels = image.channels || 4;
                    image.data = data;
                    if (!('type' in options) && image.type === GL_UNSIGNED_BYTE$5) {
                        image.type = typedArrayCode$1(data);
                    }
                }
                else if (isNumericArray(data)) {
                    image.channels = image.channels || 4;
                    convertData(image, data);
                    image.alignment = 1;
                    image.needsFree = true;
                }
                else if (isNDArrayLike(data)) {
                    var array = data.data;
                    if (!Array.isArray(array) && image.type === GL_UNSIGNED_BYTE$5) {
                        image.type = typedArrayCode$1(array);
                    }
                    var shape = data.shape;
                    var stride = data.stride;
                    var shapeX, shapeY, shapeC, strideX, strideY, strideC;
                    if (shape.length === 3) {
                        shapeC = shape[2];
                        strideC = stride[2];
                    }
                    else {
                        check$1(shape.length === 2, 'invalid ndarray pixel data, must be 2 or 3D');
                        shapeC = 1;
                        strideC = 1;
                    }
                    shapeX = shape[0];
                    shapeY = shape[1];
                    strideX = stride[0];
                    strideY = stride[1];
                    image.alignment = 1;
                    image.width = shapeX;
                    image.height = shapeY;
                    image.channels = shapeC;
                    image.format = image.internalformat = CHANNELS_FORMAT[shapeC];
                    image.needsFree = true;
                    transposeData(image, array, strideX, strideY, strideC, data.offset);
                }
                else if (isCanvasElement(data) || isOffscreenCanvas(data) || isContext2D(data)) {
                    if (isCanvasElement(data) || isOffscreenCanvas(data)) {
                        image.element = data;
                    }
                    else {
                        image.element = data.canvas;
                    }
                    image.width = image.element.width;
                    image.height = image.element.height;
                    image.channels = 4;
                }
                else if (isBitmap(data)) {
                    image.element = data;
                    image.width = data.width;
                    image.height = data.height;
                    image.channels = 4;
                }
                else if (isImageElement(data)) {
                    image.element = data;
                    image.width = data.naturalWidth;
                    image.height = data.naturalHeight;
                    image.channels = 4;
                }
                else if (isVideoElement(data)) {
                    image.element = data;
                    image.width = data.videoWidth;
                    image.height = data.videoHeight;
                    image.channels = 4;
                }
                else if (isRectArray(data)) {
                    var w = image.width || data[0].length;
                    var h = image.height || data.length;
                    var c = image.channels;
                    if (isArrayLike(data[0][0])) {
                        c = c || data[0][0].length;
                    }
                    else {
                        c = c || 1;
                    }
                    var arrayShape = flattenUtils.shape(data);
                    var n = 1;
                    for (var dd = 0; dd < arrayShape.length; ++dd) {
                        n *= arrayShape[dd];
                    }
                    var allocData = preConvert(image, n);
                    flattenUtils.flatten(data, arrayShape, '', allocData);
                    postConvert(image, allocData);
                    image.alignment = 1;
                    image.width = w;
                    image.height = h;
                    image.channels = c;
                    image.format = image.internalformat = CHANNELS_FORMAT[c];
                    image.needsFree = true;
                }
                if (image.type === GL_FLOAT$4) {
                    check$1(limits.extensions.indexOf('oes_texture_float') >= 0, 'oes_texture_float extension not enabled');
                }
                else if (image.type === GL_HALF_FLOAT_OES$1) {
                    check$1(limits.extensions.indexOf('oes_texture_half_float') >= 0, 'oes_texture_half_float extension not enabled');
                }
                // do compressed texture  validation here.
            }
            function setImage(info, target, miplevel) {
                var element = info.element;
                var data = info.data;
                var internalformat = info.internalformat;
                var format = info.format;
                var type = info.type;
                var width = info.width;
                var height = info.height;
                setFlags(info);
                if (element) {
                    gl.texImage2D(target, miplevel, format, format, type, element);
                }
                else if (info.compressed) {
                    gl.compressedTexImage2D(target, miplevel, internalformat, width, height, 0, data);
                }
                else if (info.needsCopy) {
                    reglPoll();
                    gl.copyTexImage2D(target, miplevel, format, info.xOffset, info.yOffset, width, height, 0);
                }
                else {
                    gl.texImage2D(target, miplevel, format, width, height, 0, format, type, data || null);
                }
            }
            function setSubImage(info, target, x, y, miplevel) {
                var element = info.element;
                var data = info.data;
                var internalformat = info.internalformat;
                var format = info.format;
                var type = info.type;
                var width = info.width;
                var height = info.height;
                setFlags(info);
                if (element) {
                    gl.texSubImage2D(target, miplevel, x, y, format, type, element);
                }
                else if (info.compressed) {
                    gl.compressedTexSubImage2D(target, miplevel, x, y, internalformat, width, height, data);
                }
                else if (info.needsCopy) {
                    reglPoll();
                    gl.copyTexSubImage2D(target, miplevel, x, y, info.xOffset, info.yOffset, width, height);
                }
                else {
                    gl.texSubImage2D(target, miplevel, x, y, width, height, format, type, data);
                }
            }
            // texImage pool
            var imagePool = [];
            function allocImage() {
                return imagePool.pop() || new TexImage();
            }
            function freeImage(image) {
                if (image.needsFree) {
                    pool.freeType(image.data);
                }
                TexImage.call(image);
                imagePool.push(image);
            }
            // -------------------------------------------------------
            // Mip map
            // -------------------------------------------------------
            function MipMap() {
                TexFlags.call(this);
                this.genMipmaps = false;
                this.mipmapHint = GL_DONT_CARE;
                this.mipmask = 0;
                this.images = Array(16);
            }
            function parseMipMapFromShape(mipmap, width, height) {
                var img = mipmap.images[0] = allocImage();
                mipmap.mipmask = 1;
                img.width = mipmap.width = width;
                img.height = mipmap.height = height;
                img.channels = mipmap.channels = 4;
            }
            function parseMipMapFromObject(mipmap, options) {
                var imgData = null;
                if (isPixelData(options)) {
                    imgData = mipmap.images[0] = allocImage();
                    copyFlags(imgData, mipmap);
                    parseImage(imgData, options);
                    mipmap.mipmask = 1;
                }
                else {
                    parseFlags(mipmap, options);
                    if (Array.isArray(options.mipmap)) {
                        var mipData = options.mipmap;
                        for (var i = 0; i < mipData.length; ++i) {
                            imgData = mipmap.images[i] = allocImage();
                            copyFlags(imgData, mipmap);
                            imgData.width >>= i;
                            imgData.height >>= i;
                            parseImage(imgData, mipData[i]);
                            mipmap.mipmask |= (1 << i);
                        }
                    }
                    else {
                        imgData = mipmap.images[0] = allocImage();
                        copyFlags(imgData, mipmap);
                        parseImage(imgData, options);
                        mipmap.mipmask = 1;
                    }
                }
                copyFlags(mipmap, mipmap.images[0]);
                // For textures of the compressed format WEBGL_compressed_texture_s3tc
                // we must have that
                //
                // "When level equals zero width and height must be a multiple of 4.
                // When level is greater than 0 width and height must be 0, 1, 2 or a multiple of 4. "
                //
                // but we do not yet support having multiple mipmap levels for compressed textures,
                // so we only test for level zero.
                if (mipmap.compressed &&
                    (mipmap.internalformat === GL_COMPRESSED_RGB_S3TC_DXT1_EXT ||
                        mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT1_EXT ||
                        mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT3_EXT ||
                        mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT5_EXT)) {
                    check$1(mipmap.width % 4 === 0 && mipmap.height % 4 === 0, 'for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4');
                }
            }
            function setMipMap(mipmap, target) {
                var images = mipmap.images;
                for (var i = 0; i < images.length; ++i) {
                    if (!images[i]) {
                        return;
                    }
                    setImage(images[i], target, i);
                }
            }
            var mipPool = [];
            function allocMipMap() {
                var result = mipPool.pop() || new MipMap();
                TexFlags.call(result);
                result.mipmask = 0;
                for (var i = 0; i < 16; ++i) {
                    result.images[i] = null;
                }
                return result;
            }
            function freeMipMap(mipmap) {
                var images = mipmap.images;
                for (var i = 0; i < images.length; ++i) {
                    if (images[i]) {
                        freeImage(images[i]);
                    }
                    images[i] = null;
                }
                mipPool.push(mipmap);
            }
            // -------------------------------------------------------
            // Tex info
            // -------------------------------------------------------
            function TexInfo() {
                this.minFilter = GL_NEAREST$1;
                this.magFilter = GL_NEAREST$1;
                this.wrapS = GL_CLAMP_TO_EDGE$1;
                this.wrapT = GL_CLAMP_TO_EDGE$1;
                this.anisotropic = 1;
                this.genMipmaps = false;
                this.mipmapHint = GL_DONT_CARE;
            }
            function parseTexInfo(info, options) {
                if ('min' in options) {
                    var minFilter = options.min;
                    check$1.parameter(minFilter, minFilters);
                    info.minFilter = minFilters[minFilter];
                    if (MIPMAP_FILTERS.indexOf(info.minFilter) >= 0 && !('faces' in options)) {
                        info.genMipmaps = true;
                    }
                }
                if ('mag' in options) {
                    var magFilter = options.mag;
                    check$1.parameter(magFilter, magFilters);
                    info.magFilter = magFilters[magFilter];
                }
                var wrapS = info.wrapS;
                var wrapT = info.wrapT;
                if ('wrap' in options) {
                    var wrap = options.wrap;
                    if (typeof wrap === 'string') {
                        check$1.parameter(wrap, wrapModes);
                        wrapS = wrapT = wrapModes[wrap];
                    }
                    else if (Array.isArray(wrap)) {
                        check$1.parameter(wrap[0], wrapModes);
                        check$1.parameter(wrap[1], wrapModes);
                        wrapS = wrapModes[wrap[0]];
                        wrapT = wrapModes[wrap[1]];
                    }
                }
                else {
                    if ('wrapS' in options) {
                        var optWrapS = options.wrapS;
                        check$1.parameter(optWrapS, wrapModes);
                        wrapS = wrapModes[optWrapS];
                    }
                    if ('wrapT' in options) {
                        var optWrapT = options.wrapT;
                        check$1.parameter(optWrapT, wrapModes);
                        wrapT = wrapModes[optWrapT];
                    }
                }
                info.wrapS = wrapS;
                info.wrapT = wrapT;
                if ('anisotropic' in options) {
                    var anisotropic = options.anisotropic;
                    check$1(typeof anisotropic === 'number' &&
                        anisotropic >= 1 && anisotropic <= limits.maxAnisotropic, 'aniso samples must be between 1 and ');
                    info.anisotropic = options.anisotropic;
                }
                if ('mipmap' in options) {
                    var hasMipMap = false;
                    switch (typeof options.mipmap) {
                        case 'string':
                            check$1.parameter(options.mipmap, mipmapHint, 'invalid mipmap hint');
                            info.mipmapHint = mipmapHint[options.mipmap];
                            info.genMipmaps = true;
                            hasMipMap = true;
                            break;
                        case 'boolean':
                            hasMipMap = info.genMipmaps = options.mipmap;
                            break;
                        case 'object':
                            check$1(Array.isArray(options.mipmap), 'invalid mipmap type');
                            info.genMipmaps = false;
                            hasMipMap = true;
                            break;
                        default:
                            check$1.raise('invalid mipmap type');
                    }
                    if (hasMipMap && !('min' in options)) {
                        info.minFilter = GL_NEAREST_MIPMAP_NEAREST$1;
                    }
                }
            }
            function setTexInfo(info, target) {
                gl.texParameteri(target, GL_TEXTURE_MIN_FILTER, info.minFilter);
                gl.texParameteri(target, GL_TEXTURE_MAG_FILTER, info.magFilter);
                gl.texParameteri(target, GL_TEXTURE_WRAP_S, info.wrapS);
                gl.texParameteri(target, GL_TEXTURE_WRAP_T, info.wrapT);
                if (extensions.ext_texture_filter_anisotropic) {
                    gl.texParameteri(target, GL_TEXTURE_MAX_ANISOTROPY_EXT, info.anisotropic);
                }
                if (info.genMipmaps) {
                    gl.hint(GL_GENERATE_MIPMAP_HINT, info.mipmapHint);
                    gl.generateMipmap(target);
                }
            }
            // -------------------------------------------------------
            // Full texture object
            // -------------------------------------------------------
            var textureCount = 0;
            var textureSet = {};
            var numTexUnits = limits.maxTextureUnits;
            var textureUnits = Array(numTexUnits).map(function () {
                return null;
            });
            function REGLTexture(target) {
                TexFlags.call(this);
                this.mipmask = 0;
                this.internalformat = GL_RGBA$1;
                this.id = textureCount++;
                this.refCount = 1;
                this.target = target;
                this.texture = gl.createTexture();
                this.unit = -1;
                this.bindCount = 0;
                this.texInfo = new TexInfo();
                if (config.profile) {
                    this.stats = { size: 0 };
                }
            }
            function tempBind(texture) {
                gl.activeTexture(GL_TEXTURE0$1);
                gl.bindTexture(texture.target, texture.texture);
            }
            function tempRestore() {
                var prev = textureUnits[0];
                if (prev) {
                    gl.bindTexture(prev.target, prev.texture);
                }
                else {
                    gl.bindTexture(GL_TEXTURE_2D$1, null);
                }
            }
            function destroy(texture) {
                var handle = texture.texture;
                check$1(handle, 'must not double destroy texture');
                var unit = texture.unit;
                var target = texture.target;
                if (unit >= 0) {
                    gl.activeTexture(GL_TEXTURE0$1 + unit);
                    gl.bindTexture(target, null);
                    textureUnits[unit] = null;
                }
                gl.deleteTexture(handle);
                texture.texture = null;
                texture.params = null;
                texture.pixels = null;
                texture.refCount = 0;
                delete textureSet[texture.id];
                stats.textureCount--;
            }
            extend(REGLTexture.prototype, {
                bind: function () {
                    var texture = this;
                    texture.bindCount += 1;
                    var unit = texture.unit;
                    if (unit < 0) {
                        for (var i = 0; i < numTexUnits; ++i) {
                            var other = textureUnits[i];
                            if (other) {
                                if (other.bindCount > 0) {
                                    continue;
                                }
                                other.unit = -1;
                            }
                            textureUnits[i] = texture;
                            unit = i;
                            break;
                        }
                        if (unit >= numTexUnits) {
                            check$1.raise('insufficient number of texture units');
                        }
                        if (config.profile && stats.maxTextureUnits < (unit + 1)) {
                            stats.maxTextureUnits = unit + 1; // +1, since the units are zero-based
                        }
                        texture.unit = unit;
                        gl.activeTexture(GL_TEXTURE0$1 + unit);
                        gl.bindTexture(texture.target, texture.texture);
                    }
                    return unit;
                },
                unbind: function () {
                    this.bindCount -= 1;
                },
                decRef: function () {
                    if (--this.refCount <= 0) {
                        destroy(this);
                    }
                }
            });
            function createTexture2D(a, b) {
                var texture = new REGLTexture(GL_TEXTURE_2D$1);
                textureSet[texture.id] = texture;
                stats.textureCount++;
                function reglTexture2D(a, b) {
                    var texInfo = texture.texInfo;
                    TexInfo.call(texInfo);
                    var mipData = allocMipMap();
                    if (typeof a === 'number') {
                        if (typeof b === 'number') {
                            parseMipMapFromShape(mipData, a | 0, b | 0);
                        }
                        else {
                            parseMipMapFromShape(mipData, a | 0, a | 0);
                        }
                    }
                    else if (a) {
                        check$1.type(a, 'object', 'invalid arguments to regl.texture');
                        parseTexInfo(texInfo, a);
                        parseMipMapFromObject(mipData, a);
                    }
                    else {
                        // empty textures get assigned a default shape of 1x1
                        parseMipMapFromShape(mipData, 1, 1);
                    }
                    if (texInfo.genMipmaps) {
                        mipData.mipmask = (mipData.width << 1) - 1;
                    }
                    texture.mipmask = mipData.mipmask;
                    copyFlags(texture, mipData);
                    check$1.texture2D(texInfo, mipData, limits);
                    texture.internalformat = mipData.internalformat;
                    reglTexture2D.width = mipData.width;
                    reglTexture2D.height = mipData.height;
                    tempBind(texture);
                    setMipMap(mipData, GL_TEXTURE_2D$1);
                    setTexInfo(texInfo, GL_TEXTURE_2D$1);
                    tempRestore();
                    freeMipMap(mipData);
                    if (config.profile) {
                        texture.stats.size = getTextureSize(texture.internalformat, texture.type, mipData.width, mipData.height, texInfo.genMipmaps, false);
                    }
                    reglTexture2D.format = textureFormatsInvert[texture.internalformat];
                    reglTexture2D.type = textureTypesInvert[texture.type];
                    reglTexture2D.mag = magFiltersInvert[texInfo.magFilter];
                    reglTexture2D.min = minFiltersInvert[texInfo.minFilter];
                    reglTexture2D.wrapS = wrapModesInvert[texInfo.wrapS];
                    reglTexture2D.wrapT = wrapModesInvert[texInfo.wrapT];
                    return reglTexture2D;
                }
                function subimage(image, x_, y_, level_) {
                    check$1(!!image, 'must specify image data');
                    var x = x_ | 0;
                    var y = y_ | 0;
                    var level = level_ | 0;
                    var imageData = allocImage();
                    copyFlags(imageData, texture);
                    imageData.width = 0;
                    imageData.height = 0;
                    parseImage(imageData, image);
                    imageData.width = imageData.width || ((texture.width >> level) - x);
                    imageData.height = imageData.height || ((texture.height >> level) - y);
                    check$1(texture.type === imageData.type &&
                        texture.format === imageData.format &&
                        texture.internalformat === imageData.internalformat, 'incompatible format for texture.subimage');
                    check$1(x >= 0 && y >= 0 &&
                        x + imageData.width <= texture.width &&
                        y + imageData.height <= texture.height, 'texture.subimage write out of bounds');
                    check$1(texture.mipmask & (1 << level), 'missing mipmap data');
                    check$1(imageData.data || imageData.element || imageData.needsCopy, 'missing image data');
                    tempBind(texture);
                    setSubImage(imageData, GL_TEXTURE_2D$1, x, y, level);
                    tempRestore();
                    freeImage(imageData);
                    return reglTexture2D;
                }
                function resize(w_, h_) {
                    var w = w_ | 0;
                    var h = (h_ | 0) || w;
                    if (w === texture.width && h === texture.height) {
                        return reglTexture2D;
                    }
                    reglTexture2D.width = texture.width = w;
                    reglTexture2D.height = texture.height = h;
                    tempBind(texture);
                    for (var i = 0; texture.mipmask >> i; ++i) {
                        var _w = w >> i;
                        var _h = h >> i;
                        if (!_w || !_h)
                            break;
                        gl.texImage2D(GL_TEXTURE_2D$1, i, texture.format, _w, _h, 0, texture.format, texture.type, null);
                    }
                    tempRestore();
                    // also, recompute the texture size.
                    if (config.profile) {
                        texture.stats.size = getTextureSize(texture.internalformat, texture.type, w, h, false, false);
                    }
                    return reglTexture2D;
                }
                reglTexture2D(a, b);
                reglTexture2D.subimage = subimage;
                reglTexture2D.resize = resize;
                reglTexture2D._reglType = 'texture2d';
                reglTexture2D._texture = texture;
                if (config.profile) {
                    reglTexture2D.stats = texture.stats;
                }
                reglTexture2D.destroy = function () {
                    texture.decRef();
                };
                return reglTexture2D;
            }
            function createTextureCube(a0, a1, a2, a3, a4, a5) {
                var texture = new REGLTexture(GL_TEXTURE_CUBE_MAP$1);
                textureSet[texture.id] = texture;
                stats.cubeCount++;
                var faces = new Array(6);
                function reglTextureCube(a0, a1, a2, a3, a4, a5) {
                    var i;
                    var texInfo = texture.texInfo;
                    TexInfo.call(texInfo);
                    for (i = 0; i < 6; ++i) {
                        faces[i] = allocMipMap();
                    }
                    if (typeof a0 === 'number' || !a0) {
                        var s = (a0 | 0) || 1;
                        for (i = 0; i < 6; ++i) {
                            parseMipMapFromShape(faces[i], s, s);
                        }
                    }
                    else if (typeof a0 === 'object') {
                        if (a1) {
                            parseMipMapFromObject(faces[0], a0);
                            parseMipMapFromObject(faces[1], a1);
                            parseMipMapFromObject(faces[2], a2);
                            parseMipMapFromObject(faces[3], a3);
                            parseMipMapFromObject(faces[4], a4);
                            parseMipMapFromObject(faces[5], a5);
                        }
                        else {
                            parseTexInfo(texInfo, a0);
                            parseFlags(texture, a0);
                            if ('faces' in a0) {
                                var faceInput = a0.faces;
                                check$1(Array.isArray(faceInput) && faceInput.length === 6, 'cube faces must be a length 6 array');
                                for (i = 0; i < 6; ++i) {
                                    check$1(typeof faceInput[i] === 'object' && !!faceInput[i], 'invalid input for cube map face');
                                    copyFlags(faces[i], texture);
                                    parseMipMapFromObject(faces[i], faceInput[i]);
                                }
                            }
                            else {
                                for (i = 0; i < 6; ++i) {
                                    parseMipMapFromObject(faces[i], a0);
                                }
                            }
                        }
                    }
                    else {
                        check$1.raise('invalid arguments to cube map');
                    }
                    copyFlags(texture, faces[0]);
                    check$1.optional(function () {
                        if (!limits.npotTextureCube) {
                            check$1(isPow2$1(texture.width) && isPow2$1(texture.height), 'your browser does not support non power or two texture dimensions');
                        }
                    });
                    if (texInfo.genMipmaps) {
                        texture.mipmask = (faces[0].width << 1) - 1;
                    }
                    else {
                        texture.mipmask = faces[0].mipmask;
                    }
                    check$1.textureCube(texture, texInfo, faces, limits);
                    texture.internalformat = faces[0].internalformat;
                    reglTextureCube.width = faces[0].width;
                    reglTextureCube.height = faces[0].height;
                    tempBind(texture);
                    for (i = 0; i < 6; ++i) {
                        setMipMap(faces[i], GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i);
                    }
                    setTexInfo(texInfo, GL_TEXTURE_CUBE_MAP$1);
                    tempRestore();
                    if (config.profile) {
                        texture.stats.size = getTextureSize(texture.internalformat, texture.type, reglTextureCube.width, reglTextureCube.height, texInfo.genMipmaps, true);
                    }
                    reglTextureCube.format = textureFormatsInvert[texture.internalformat];
                    reglTextureCube.type = textureTypesInvert[texture.type];
                    reglTextureCube.mag = magFiltersInvert[texInfo.magFilter];
                    reglTextureCube.min = minFiltersInvert[texInfo.minFilter];
                    reglTextureCube.wrapS = wrapModesInvert[texInfo.wrapS];
                    reglTextureCube.wrapT = wrapModesInvert[texInfo.wrapT];
                    for (i = 0; i < 6; ++i) {
                        freeMipMap(faces[i]);
                    }
                    return reglTextureCube;
                }
                function subimage(face, image, x_, y_, level_) {
                    check$1(!!image, 'must specify image data');
                    check$1(typeof face === 'number' && face === (face | 0) &&
                        face >= 0 && face < 6, 'invalid face');
                    var x = x_ | 0;
                    var y = y_ | 0;
                    var level = level_ | 0;
                    var imageData = allocImage();
                    copyFlags(imageData, texture);
                    imageData.width = 0;
                    imageData.height = 0;
                    parseImage(imageData, image);
                    imageData.width = imageData.width || ((texture.width >> level) - x);
                    imageData.height = imageData.height || ((texture.height >> level) - y);
                    check$1(texture.type === imageData.type &&
                        texture.format === imageData.format &&
                        texture.internalformat === imageData.internalformat, 'incompatible format for texture.subimage');
                    check$1(x >= 0 && y >= 0 &&
                        x + imageData.width <= texture.width &&
                        y + imageData.height <= texture.height, 'texture.subimage write out of bounds');
                    check$1(texture.mipmask & (1 << level), 'missing mipmap data');
                    check$1(imageData.data || imageData.element || imageData.needsCopy, 'missing image data');
                    tempBind(texture);
                    setSubImage(imageData, GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + face, x, y, level);
                    tempRestore();
                    freeImage(imageData);
                    return reglTextureCube;
                }
                function resize(radius_) {
                    var radius = radius_ | 0;
                    if (radius === texture.width) {
                        return;
                    }
                    reglTextureCube.width = texture.width = radius;
                    reglTextureCube.height = texture.height = radius;
                    tempBind(texture);
                    for (var i = 0; i < 6; ++i) {
                        for (var j = 0; texture.mipmask >> j; ++j) {
                            gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i, j, texture.format, radius >> j, radius >> j, 0, texture.format, texture.type, null);
                        }
                    }
                    tempRestore();
                    if (config.profile) {
                        texture.stats.size = getTextureSize(texture.internalformat, texture.type, reglTextureCube.width, reglTextureCube.height, false, true);
                    }
                    return reglTextureCube;
                }
                reglTextureCube(a0, a1, a2, a3, a4, a5);
                reglTextureCube.subimage = subimage;
                reglTextureCube.resize = resize;
                reglTextureCube._reglType = 'textureCube';
                reglTextureCube._texture = texture;
                if (config.profile) {
                    reglTextureCube.stats = texture.stats;
                }
                reglTextureCube.destroy = function () {
                    texture.decRef();
                };
                return reglTextureCube;
            }
            // Called when regl is destroyed
            function destroyTextures() {
                for (var i = 0; i < numTexUnits; ++i) {
                    gl.activeTexture(GL_TEXTURE0$1 + i);
                    gl.bindTexture(GL_TEXTURE_2D$1, null);
                    textureUnits[i] = null;
                }
                values(textureSet).forEach(destroy);
                stats.cubeCount = 0;
                stats.textureCount = 0;
            }
            if (config.profile) {
                stats.getTotalTextureSize = function () {
                    var total = 0;
                    Object.keys(textureSet).forEach(function (key) {
                        total += textureSet[key].stats.size;
                    });
                    return total;
                };
            }
            function restoreTextures() {
                for (var i = 0; i < numTexUnits; ++i) {
                    var tex = textureUnits[i];
                    if (tex) {
                        tex.bindCount = 0;
                        tex.unit = -1;
                        textureUnits[i] = null;
                    }
                }
                values(textureSet).forEach(function (texture) {
                    texture.texture = gl.createTexture();
                    gl.bindTexture(texture.target, texture.texture);
                    for (var i = 0; i < 32; ++i) {
                        if ((texture.mipmask & (1 << i)) === 0) {
                            continue;
                        }
                        if (texture.target === GL_TEXTURE_2D$1) {
                            gl.texImage2D(GL_TEXTURE_2D$1, i, texture.internalformat, texture.width >> i, texture.height >> i, 0, texture.internalformat, texture.type, null);
                        }
                        else {
                            for (var j = 0; j < 6; ++j) {
                                gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + j, i, texture.internalformat, texture.width >> i, texture.height >> i, 0, texture.internalformat, texture.type, null);
                            }
                        }
                    }
                    setTexInfo(texture.texInfo, texture.target);
                });
            }
            function refreshTextures() {
                for (var i = 0; i < numTexUnits; ++i) {
                    var tex = textureUnits[i];
                    if (tex) {
                        tex.bindCount = 0;
                        tex.unit = -1;
                        textureUnits[i] = null;
                    }
                    gl.activeTexture(GL_TEXTURE0$1 + i);
                    gl.bindTexture(GL_TEXTURE_2D$1, null);
                    gl.bindTexture(GL_TEXTURE_CUBE_MAP$1, null);
                }
            }
            return {
                create2D: createTexture2D,
                createCube: createTextureCube,
                clear: destroyTextures,
                getTexture: function (wrapper) {
                    return null;
                },
                restore: restoreTextures,
                refresh: refreshTextures
            };
        }
        var GL_RENDERBUFFER = 0x8D41;
        var GL_RGBA4$1 = 0x8056;
        var GL_RGB5_A1$1 = 0x8057;
        var GL_RGB565$1 = 0x8D62;
        var GL_DEPTH_COMPONENT16 = 0x81A5;
        var GL_STENCIL_INDEX8 = 0x8D48;
        var GL_DEPTH_STENCIL$1 = 0x84F9;
        var GL_SRGB8_ALPHA8_EXT = 0x8C43;
        var GL_RGBA32F_EXT = 0x8814;
        var GL_RGBA16F_EXT = 0x881A;
        var GL_RGB16F_EXT = 0x881B;
        var FORMAT_SIZES = [];
        FORMAT_SIZES[GL_RGBA4$1] = 2;
        FORMAT_SIZES[GL_RGB5_A1$1] = 2;
        FORMAT_SIZES[GL_RGB565$1] = 2;
        FORMAT_SIZES[GL_DEPTH_COMPONENT16] = 2;
        FORMAT_SIZES[GL_STENCIL_INDEX8] = 1;
        FORMAT_SIZES[GL_DEPTH_STENCIL$1] = 4;
        FORMAT_SIZES[GL_SRGB8_ALPHA8_EXT] = 4;
        FORMAT_SIZES[GL_RGBA32F_EXT] = 16;
        FORMAT_SIZES[GL_RGBA16F_EXT] = 8;
        FORMAT_SIZES[GL_RGB16F_EXT] = 6;
        function getRenderbufferSize(format, width, height) {
            return FORMAT_SIZES[format] * width * height;
        }
        var wrapRenderbuffers = function (gl, extensions, limits, stats, config) {
            var formatTypes = {
                'rgba4': GL_RGBA4$1,
                'rgb565': GL_RGB565$1,
                'rgb5 a1': GL_RGB5_A1$1,
                'depth': GL_DEPTH_COMPONENT16,
                'stencil': GL_STENCIL_INDEX8,
                'depth stencil': GL_DEPTH_STENCIL$1
            };
            if (extensions.ext_srgb) {
                formatTypes['srgba'] = GL_SRGB8_ALPHA8_EXT;
            }
            if (extensions.ext_color_buffer_half_float) {
                formatTypes['rgba16f'] = GL_RGBA16F_EXT;
                formatTypes['rgb16f'] = GL_RGB16F_EXT;
            }
            if (extensions.webgl_color_buffer_float) {
                formatTypes['rgba32f'] = GL_RGBA32F_EXT;
            }
            var formatTypesInvert = [];
            Object.keys(formatTypes).forEach(function (key) {
                var val = formatTypes[key];
                formatTypesInvert[val] = key;
            });
            var renderbufferCount = 0;
            var renderbufferSet = {};
            function REGLRenderbuffer(renderbuffer) {
                this.id = renderbufferCount++;
                this.refCount = 1;
                this.renderbuffer = renderbuffer;
                this.format = GL_RGBA4$1;
                this.width = 0;
                this.height = 0;
                if (config.profile) {
                    this.stats = { size: 0 };
                }
            }
            REGLRenderbuffer.prototype.decRef = function () {
                if (--this.refCount <= 0) {
                    destroy(this);
                }
            };
            function destroy(rb) {
                var handle = rb.renderbuffer;
                check$1(handle, 'must not double destroy renderbuffer');
                gl.bindRenderbuffer(GL_RENDERBUFFER, null);
                gl.deleteRenderbuffer(handle);
                rb.renderbuffer = null;
                rb.refCount = 0;
                delete renderbufferSet[rb.id];
                stats.renderbufferCount--;
            }
            function createRenderbuffer(a, b) {
                var renderbuffer = new REGLRenderbuffer(gl.createRenderbuffer());
                renderbufferSet[renderbuffer.id] = renderbuffer;
                stats.renderbufferCount++;
                function reglRenderbuffer(a, b) {
                    var w = 0;
                    var h = 0;
                    var format = GL_RGBA4$1;
                    if (typeof a === 'object' && a) {
                        var options = a;
                        if ('shape' in options) {
                            var shape = options.shape;
                            check$1(Array.isArray(shape) && shape.length >= 2, 'invalid renderbuffer shape');
                            w = shape[0] | 0;
                            h = shape[1] | 0;
                        }
                        else {
                            if ('radius' in options) {
                                w = h = options.radius | 0;
                            }
                            if ('width' in options) {
                                w = options.width | 0;
                            }
                            if ('height' in options) {
                                h = options.height | 0;
                            }
                        }
                        if ('format' in options) {
                            check$1.parameter(options.format, formatTypes, 'invalid renderbuffer format');
                            format = formatTypes[options.format];
                        }
                    }
                    else if (typeof a === 'number') {
                        w = a | 0;
                        if (typeof b === 'number') {
                            h = b | 0;
                        }
                        else {
                            h = w;
                        }
                    }
                    else if (!a) {
                        w = h = 1;
                    }
                    else {
                        check$1.raise('invalid arguments to renderbuffer constructor');
                    }
                    // check shape
                    check$1(w > 0 && h > 0 &&
                        w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize, 'invalid renderbuffer size');
                    if (w === renderbuffer.width &&
                        h === renderbuffer.height &&
                        format === renderbuffer.format) {
                        return;
                    }
                    reglRenderbuffer.width = renderbuffer.width = w;
                    reglRenderbuffer.height = renderbuffer.height = h;
                    renderbuffer.format = format;
                    gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
                    gl.renderbufferStorage(GL_RENDERBUFFER, format, w, h);
                    check$1(gl.getError() === 0, 'invalid render buffer format');
                    if (config.profile) {
                        renderbuffer.stats.size = getRenderbufferSize(renderbuffer.format, renderbuffer.width, renderbuffer.height);
                    }
                    reglRenderbuffer.format = formatTypesInvert[renderbuffer.format];
                    return reglRenderbuffer;
                }
                function resize(w_, h_) {
                    var w = w_ | 0;
                    var h = (h_ | 0) || w;
                    if (w === renderbuffer.width && h === renderbuffer.height) {
                        return reglRenderbuffer;
                    }
                    // check shape
                    check$1(w > 0 && h > 0 &&
                        w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize, 'invalid renderbuffer size');
                    reglRenderbuffer.width = renderbuffer.width = w;
                    reglRenderbuffer.height = renderbuffer.height = h;
                    gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
                    gl.renderbufferStorage(GL_RENDERBUFFER, renderbuffer.format, w, h);
                    check$1(gl.getError() === 0, 'invalid render buffer format');
                    // also, recompute size.
                    if (config.profile) {
                        renderbuffer.stats.size = getRenderbufferSize(renderbuffer.format, renderbuffer.width, renderbuffer.height);
                    }
                    return reglRenderbuffer;
                }
                reglRenderbuffer(a, b);
                reglRenderbuffer.resize = resize;
                reglRenderbuffer._reglType = 'renderbuffer';
                reglRenderbuffer._renderbuffer = renderbuffer;
                if (config.profile) {
                    reglRenderbuffer.stats = renderbuffer.stats;
                }
                reglRenderbuffer.destroy = function () {
                    renderbuffer.decRef();
                };
                return reglRenderbuffer;
            }
            if (config.profile) {
                stats.getTotalRenderbufferSize = function () {
                    var total = 0;
                    Object.keys(renderbufferSet).forEach(function (key) {
                        total += renderbufferSet[key].stats.size;
                    });
                    return total;
                };
            }
            function restoreRenderbuffers() {
                values(renderbufferSet).forEach(function (rb) {
                    rb.renderbuffer = gl.createRenderbuffer();
                    gl.bindRenderbuffer(GL_RENDERBUFFER, rb.renderbuffer);
                    gl.renderbufferStorage(GL_RENDERBUFFER, rb.format, rb.width, rb.height);
                });
                gl.bindRenderbuffer(GL_RENDERBUFFER, null);
            }
            return {
                create: createRenderbuffer,
                clear: function () {
                    values(renderbufferSet).forEach(destroy);
                },
                restore: restoreRenderbuffers
            };
        };
        // We store these constants so that the minifier can inline them
        var GL_FRAMEBUFFER$1 = 0x8D40;
        var GL_RENDERBUFFER$1 = 0x8D41;
        var GL_TEXTURE_2D$2 = 0x0DE1;
        var GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 = 0x8515;
        var GL_COLOR_ATTACHMENT0$1 = 0x8CE0;
        var GL_DEPTH_ATTACHMENT = 0x8D00;
        var GL_STENCIL_ATTACHMENT = 0x8D20;
        var GL_DEPTH_STENCIL_ATTACHMENT = 0x821A;
        var GL_FRAMEBUFFER_COMPLETE$1 = 0x8CD5;
        var GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6;
        var GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
        var GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9;
        var GL_FRAMEBUFFER_UNSUPPORTED = 0x8CDD;
        var GL_HALF_FLOAT_OES$2 = 0x8D61;
        var GL_UNSIGNED_BYTE$6 = 0x1401;
        var GL_FLOAT$5 = 0x1406;
        var GL_RGB$1 = 0x1907;
        var GL_RGBA$2 = 0x1908;
        var GL_DEPTH_COMPONENT$1 = 0x1902;
        var colorTextureFormatEnums = [
            GL_RGB$1,
            GL_RGBA$2
        ];
        // for every texture format, store
        // the number of channels
        var textureFormatChannels = [];
        textureFormatChannels[GL_RGBA$2] = 4;
        textureFormatChannels[GL_RGB$1] = 3;
        // for every texture type, store
        // the size in bytes.
        var textureTypeSizes = [];
        textureTypeSizes[GL_UNSIGNED_BYTE$6] = 1;
        textureTypeSizes[GL_FLOAT$5] = 4;
        textureTypeSizes[GL_HALF_FLOAT_OES$2] = 2;
        var GL_RGBA4$2 = 0x8056;
        var GL_RGB5_A1$2 = 0x8057;
        var GL_RGB565$2 = 0x8D62;
        var GL_DEPTH_COMPONENT16$1 = 0x81A5;
        var GL_STENCIL_INDEX8$1 = 0x8D48;
        var GL_DEPTH_STENCIL$2 = 0x84F9;
        var GL_SRGB8_ALPHA8_EXT$1 = 0x8C43;
        var GL_RGBA32F_EXT$1 = 0x8814;
        var GL_RGBA16F_EXT$1 = 0x881A;
        var GL_RGB16F_EXT$1 = 0x881B;
        var colorRenderbufferFormatEnums = [
            GL_RGBA4$2,
            GL_RGB5_A1$2,
            GL_RGB565$2,
            GL_SRGB8_ALPHA8_EXT$1,
            GL_RGBA16F_EXT$1,
            GL_RGB16F_EXT$1,
            GL_RGBA32F_EXT$1
        ];
        var statusCode = {};
        statusCode[GL_FRAMEBUFFER_COMPLETE$1] = 'complete';
        statusCode[GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT] = 'incomplete attachment';
        statusCode[GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS] = 'incomplete dimensions';
        statusCode[GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT] = 'incomplete, missing attachment';
        statusCode[GL_FRAMEBUFFER_UNSUPPORTED] = 'unsupported';
        function wrapFBOState(gl, extensions, limits, textureState, renderbufferState, stats) {
            var framebufferState = {
                cur: null,
                next: null,
                dirty: false,
                setFBO: null
            };
            var colorTextureFormats = ['rgba'];
            var colorRenderbufferFormats = ['rgba4', 'rgb565', 'rgb5 a1'];
            if (extensions.ext_srgb) {
                colorRenderbufferFormats.push('srgba');
            }
            if (extensions.ext_color_buffer_half_float) {
                colorRenderbufferFormats.push('rgba16f', 'rgb16f');
            }
            if (extensions.webgl_color_buffer_float) {
                colorRenderbufferFormats.push('rgba32f');
            }
            var colorTypes = ['uint8'];
            if (extensions.oes_texture_half_float) {
                colorTypes.push('half float', 'float16');
            }
            if (extensions.oes_texture_float) {
                colorTypes.push('float', 'float32');
            }
            function FramebufferAttachment(target, texture, renderbuffer) {
                this.target = target;
                this.texture = texture;
                this.renderbuffer = renderbuffer;
                var w = 0;
                var h = 0;
                if (texture) {
                    w = texture.width;
                    h = texture.height;
                }
                else if (renderbuffer) {
                    w = renderbuffer.width;
                    h = renderbuffer.height;
                }
                this.width = w;
                this.height = h;
            }
            function decRef(attachment) {
                if (attachment) {
                    if (attachment.texture) {
                        attachment.texture._texture.decRef();
                    }
                    if (attachment.renderbuffer) {
                        attachment.renderbuffer._renderbuffer.decRef();
                    }
                }
            }
            function incRefAndCheckShape(attachment, width, height) {
                if (!attachment) {
                    return;
                }
                if (attachment.texture) {
                    var texture = attachment.texture._texture;
                    var tw = Math.max(1, texture.width);
                    var th = Math.max(1, texture.height);
                    check$1(tw === width && th === height, 'inconsistent width/height for supplied texture');
                    texture.refCount += 1;
                }
                else {
                    var renderbuffer = attachment.renderbuffer._renderbuffer;
                    check$1(renderbuffer.width === width && renderbuffer.height === height, 'inconsistent width/height for renderbuffer');
                    renderbuffer.refCount += 1;
                }
            }
            function attach(location, attachment) {
                if (attachment) {
                    if (attachment.texture) {
                        gl.framebufferTexture2D(GL_FRAMEBUFFER$1, location, attachment.target, attachment.texture._texture.texture, 0);
                    }
                    else {
                        gl.framebufferRenderbuffer(GL_FRAMEBUFFER$1, location, GL_RENDERBUFFER$1, attachment.renderbuffer._renderbuffer.renderbuffer);
                    }
                }
            }
            function parseAttachment(attachment) {
                var target = GL_TEXTURE_2D$2;
                var texture = null;
                var renderbuffer = null;
                var data = attachment;
                if (typeof attachment === 'object') {
                    data = attachment.data;
                    if ('target' in attachment) {
                        target = attachment.target | 0;
                    }
                }
                check$1.type(data, 'function', 'invalid attachment data');
                var type = data._reglType;
                if (type === 'texture2d') {
                    texture = data;
                    check$1(target === GL_TEXTURE_2D$2);
                }
                else if (type === 'textureCube') {
                    texture = data;
                    check$1(target >= GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 &&
                        target < GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + 6, 'invalid cube map target');
                }
                else if (type === 'renderbuffer') {
                    renderbuffer = data;
                    target = GL_RENDERBUFFER$1;
                }
                else {
                    check$1.raise('invalid regl object for attachment');
                }
                return new FramebufferAttachment(target, texture, renderbuffer);
            }
            function allocAttachment(width, height, isTexture, format, type) {
                if (isTexture) {
                    var texture = textureState.create2D({
                        width: width,
                        height: height,
                        format: format,
                        type: type
                    });
                    texture._texture.refCount = 0;
                    return new FramebufferAttachment(GL_TEXTURE_2D$2, texture, null);
                }
                else {
                    var rb = renderbufferState.create({
                        width: width,
                        height: height,
                        format: format
                    });
                    rb._renderbuffer.refCount = 0;
                    return new FramebufferAttachment(GL_RENDERBUFFER$1, null, rb);
                }
            }
            function unwrapAttachment(attachment) {
                return attachment && (attachment.texture || attachment.renderbuffer);
            }
            function resizeAttachment(attachment, w, h) {
                if (attachment) {
                    if (attachment.texture) {
                        attachment.texture.resize(w, h);
                    }
                    else if (attachment.renderbuffer) {
                        attachment.renderbuffer.resize(w, h);
                    }
                    attachment.width = w;
                    attachment.height = h;
                }
            }
            var framebufferCount = 0;
            var framebufferSet = {};
            function REGLFramebuffer() {
                this.id = framebufferCount++;
                framebufferSet[this.id] = this;
                this.framebuffer = gl.createFramebuffer();
                this.width = 0;
                this.height = 0;
                this.colorAttachments = [];
                this.depthAttachment = null;
                this.stencilAttachment = null;
                this.depthStencilAttachment = null;
            }
            function decFBORefs(framebuffer) {
                framebuffer.colorAttachments.forEach(decRef);
                decRef(framebuffer.depthAttachment);
                decRef(framebuffer.stencilAttachment);
                decRef(framebuffer.depthStencilAttachment);
            }
            function destroy(framebuffer) {
                var handle = framebuffer.framebuffer;
                check$1(handle, 'must not double destroy framebuffer');
                gl.deleteFramebuffer(handle);
                framebuffer.framebuffer = null;
                stats.framebufferCount--;
                delete framebufferSet[framebuffer.id];
            }
            function updateFramebuffer(framebuffer) {
                var i;
                gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebuffer.framebuffer);
                var colorAttachments = framebuffer.colorAttachments;
                for (i = 0; i < colorAttachments.length; ++i) {
                    attach(GL_COLOR_ATTACHMENT0$1 + i, colorAttachments[i]);
                }
                for (i = colorAttachments.length; i < limits.maxColorAttachments; ++i) {
                    gl.framebufferTexture2D(GL_FRAMEBUFFER$1, GL_COLOR_ATTACHMENT0$1 + i, GL_TEXTURE_2D$2, null, 0);
                }
                gl.framebufferTexture2D(GL_FRAMEBUFFER$1, GL_DEPTH_STENCIL_ATTACHMENT, GL_TEXTURE_2D$2, null, 0);
                gl.framebufferTexture2D(GL_FRAMEBUFFER$1, GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D$2, null, 0);
                gl.framebufferTexture2D(GL_FRAMEBUFFER$1, GL_STENCIL_ATTACHMENT, GL_TEXTURE_2D$2, null, 0);
                attach(GL_DEPTH_ATTACHMENT, framebuffer.depthAttachment);
                attach(GL_STENCIL_ATTACHMENT, framebuffer.stencilAttachment);
                attach(GL_DEPTH_STENCIL_ATTACHMENT, framebuffer.depthStencilAttachment);
                // Check status code
                var status = gl.checkFramebufferStatus(GL_FRAMEBUFFER$1);
                if (!gl.isContextLost() && status !== GL_FRAMEBUFFER_COMPLETE$1) {
                    check$1.raise('framebuffer configuration not supported, status = ' +
                        statusCode[status]);
                }
                gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebufferState.next ? framebufferState.next.framebuffer : null);
                framebufferState.cur = framebufferState.next;
                // FIXME: Clear error code here.  This is a work around for a bug in
                // headless-gl
                gl.getError();
            }
            function createFBO(a0, a1) {
                var framebuffer = new REGLFramebuffer();
                stats.framebufferCount++;
                function reglFramebuffer(a, b) {
                    var i;
                    check$1(framebufferState.next !== framebuffer, 'can not update framebuffer which is currently in use');
                    var width = 0;
                    var height = 0;
                    var needsDepth = true;
                    var needsStencil = true;
                    var colorBuffer = null;
                    var colorTexture = true;
                    var colorFormat = 'rgba';
                    var colorType = 'uint8';
                    var colorCount = 1;
                    var depthBuffer = null;
                    var stencilBuffer = null;
                    var depthStencilBuffer = null;
                    var depthStencilTexture = false;
                    if (typeof a === 'number') {
                        width = a | 0;
                        height = (b | 0) || width;
                    }
                    else if (!a) {
                        width = height = 1;
                    }
                    else {
                        check$1.type(a, 'object', 'invalid arguments for framebuffer');
                        var options = a;
                        if ('shape' in options) {
                            var shape = options.shape;
                            check$1(Array.isArray(shape) && shape.length >= 2, 'invalid shape for framebuffer');
                            width = shape[0];
                            height = shape[1];
                        }
                        else {
                            if ('radius' in options) {
                                width = height = options.radius;
                            }
                            if ('width' in options) {
                                width = options.width;
                            }
                            if ('height' in options) {
                                height = options.height;
                            }
                        }
                        if ('color' in options ||
                            'colors' in options) {
                            colorBuffer =
                                options.color ||
                                    options.colors;
                            if (Array.isArray(colorBuffer)) {
                                check$1(colorBuffer.length === 1 || extensions.webgl_draw_buffers, 'multiple render targets not supported');
                            }
                        }
                        if (!colorBuffer) {
                            if ('colorCount' in options) {
                                colorCount = options.colorCount | 0;
                                check$1(colorCount > 0, 'invalid color buffer count');
                            }
                            if ('colorTexture' in options) {
                                colorTexture = !!options.colorTexture;
                                colorFormat = 'rgba4';
                            }
                            if ('colorType' in options) {
                                colorType = options.colorType;
                                if (!colorTexture) {
                                    if (colorType === 'half float' || colorType === 'float16') {
                                        check$1(extensions.ext_color_buffer_half_float, 'you must enable EXT_color_buffer_half_float to use 16-bit render buffers');
                                        colorFormat = 'rgba16f';
                                    }
                                    else if (colorType === 'float' || colorType === 'float32') {
                                        check$1(extensions.webgl_color_buffer_float, 'you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers');
                                        colorFormat = 'rgba32f';
                                    }
                                }
                                else {
                                    check$1(extensions.oes_texture_float ||
                                        !(colorType === 'float' || colorType === 'float32'), 'you must enable OES_texture_float in order to use floating point framebuffer objects');
                                    check$1(extensions.oes_texture_half_float ||
                                        !(colorType === 'half float' || colorType === 'float16'), 'you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects');
                                }
                                check$1.oneOf(colorType, colorTypes, 'invalid color type');
                            }
                            if ('colorFormat' in options) {
                                colorFormat = options.colorFormat;
                                if (colorTextureFormats.indexOf(colorFormat) >= 0) {
                                    colorTexture = true;
                                }
                                else if (colorRenderbufferFormats.indexOf(colorFormat) >= 0) {
                                    colorTexture = false;
                                }
                                else {
                                    check$1.optional(function () {
                                        if (colorTexture) {
                                            check$1.oneOf(options.colorFormat, colorTextureFormats, 'invalid color format for texture');
                                        }
                                        else {
                                            check$1.oneOf(options.colorFormat, colorRenderbufferFormats, 'invalid color format for renderbuffer');
                                        }
                                    });
                                }
                            }
                        }
                        if ('depthTexture' in options || 'depthStencilTexture' in options) {
                            depthStencilTexture = !!(options.depthTexture ||
                                options.depthStencilTexture);
                            check$1(!depthStencilTexture || extensions.webgl_depth_texture, 'webgl_depth_texture extension not supported');
                        }
                        if ('depth' in options) {
                            if (typeof options.depth === 'boolean') {
                                needsDepth = options.depth;
                            }
                            else {
                                depthBuffer = options.depth;
                                needsStencil = false;
                            }
                        }
                        if ('stencil' in options) {
                            if (typeof options.stencil === 'boolean') {
                                needsStencil = options.stencil;
                            }
                            else {
                                stencilBuffer = options.stencil;
                                needsDepth = false;
                            }
                        }
                        if ('depthStencil' in options) {
                            if (typeof options.depthStencil === 'boolean') {
                                needsDepth = needsStencil = options.depthStencil;
                            }
                            else {
                                depthStencilBuffer = options.depthStencil;
                                needsDepth = false;
                                needsStencil = false;
                            }
                        }
                    }
                    // parse attachments
                    var colorAttachments = null;
                    var depthAttachment = null;
                    var stencilAttachment = null;
                    var depthStencilAttachment = null;
                    // Set up color attachments
                    if (Array.isArray(colorBuffer)) {
                        colorAttachments = colorBuffer.map(parseAttachment);
                    }
                    else if (colorBuffer) {
                        colorAttachments = [parseAttachment(colorBuffer)];
                    }
                    else {
                        colorAttachments = new Array(colorCount);
                        for (i = 0; i < colorCount; ++i) {
                            colorAttachments[i] = allocAttachment(width, height, colorTexture, colorFormat, colorType);
                        }
                    }
                    check$1(extensions.webgl_draw_buffers || colorAttachments.length <= 1, 'you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers.');
                    check$1(colorAttachments.length <= limits.maxColorAttachments, 'too many color attachments, not supported');
                    width = width || colorAttachments[0].width;
                    height = height || colorAttachments[0].height;
                    if (depthBuffer) {
                        depthAttachment = parseAttachment(depthBuffer);
                    }
                    else if (needsDepth && !needsStencil) {
                        depthAttachment = allocAttachment(width, height, depthStencilTexture, 'depth', 'uint32');
                    }
                    if (stencilBuffer) {
                        stencilAttachment = parseAttachment(stencilBuffer);
                    }
                    else if (needsStencil && !needsDepth) {
                        stencilAttachment = allocAttachment(width, height, false, 'stencil', 'uint8');
                    }
                    if (depthStencilBuffer) {
                        depthStencilAttachment = parseAttachment(depthStencilBuffer);
                    }
                    else if (!depthBuffer && !stencilBuffer && needsStencil && needsDepth) {
                        depthStencilAttachment = allocAttachment(width, height, depthStencilTexture, 'depth stencil', 'depth stencil');
                    }
                    check$1((!!depthBuffer) + (!!stencilBuffer) + (!!depthStencilBuffer) <= 1, 'invalid framebuffer configuration, can specify exactly one depth/stencil attachment');
                    var commonColorAttachmentSize = null;
                    for (i = 0; i < colorAttachments.length; ++i) {
                        incRefAndCheckShape(colorAttachments[i], width, height);
                        check$1(!colorAttachments[i] ||
                            (colorAttachments[i].texture &&
                                colorTextureFormatEnums.indexOf(colorAttachments[i].texture._texture.format) >= 0) ||
                            (colorAttachments[i].renderbuffer &&
                                colorRenderbufferFormatEnums.indexOf(colorAttachments[i].renderbuffer._renderbuffer.format) >= 0), 'framebuffer color attachment ' + i + ' is invalid');
                        if (colorAttachments[i] && colorAttachments[i].texture) {
                            var colorAttachmentSize = textureFormatChannels[colorAttachments[i].texture._texture.format] *
                                textureTypeSizes[colorAttachments[i].texture._texture.type];
                            if (commonColorAttachmentSize === null) {
                                commonColorAttachmentSize = colorAttachmentSize;
                            }
                            else {
                                // We need to make sure that all color attachments have the same number of bitplanes
                                // (that is, the same numer of bits per pixel)
                                // This is required by the GLES2.0 standard. See the beginning of Chapter 4 in that document.
                                check$1(commonColorAttachmentSize === colorAttachmentSize, 'all color attachments much have the same number of bits per pixel.');
                            }
                        }
                    }
                    incRefAndCheckShape(depthAttachment, width, height);
                    check$1(!depthAttachment ||
                        (depthAttachment.texture &&
                            depthAttachment.texture._texture.format === GL_DEPTH_COMPONENT$1) ||
                        (depthAttachment.renderbuffer &&
                            depthAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_COMPONENT16$1), 'invalid depth attachment for framebuffer object');
                    incRefAndCheckShape(stencilAttachment, width, height);
                    check$1(!stencilAttachment ||
                        (stencilAttachment.renderbuffer &&
                            stencilAttachment.renderbuffer._renderbuffer.format === GL_STENCIL_INDEX8$1), 'invalid stencil attachment for framebuffer object');
                    incRefAndCheckShape(depthStencilAttachment, width, height);
                    check$1(!depthStencilAttachment ||
                        (depthStencilAttachment.texture &&
                            depthStencilAttachment.texture._texture.format === GL_DEPTH_STENCIL$2) ||
                        (depthStencilAttachment.renderbuffer &&
                            depthStencilAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_STENCIL$2), 'invalid depth-stencil attachment for framebuffer object');
                    // decrement references
                    decFBORefs(framebuffer);
                    framebuffer.width = width;
                    framebuffer.height = height;
                    framebuffer.colorAttachments = colorAttachments;
                    framebuffer.depthAttachment = depthAttachment;
                    framebuffer.stencilAttachment = stencilAttachment;
                    framebuffer.depthStencilAttachment = depthStencilAttachment;
                    reglFramebuffer.color = colorAttachments.map(unwrapAttachment);
                    reglFramebuffer.depth = unwrapAttachment(depthAttachment);
                    reglFramebuffer.stencil = unwrapAttachment(stencilAttachment);
                    reglFramebuffer.depthStencil = unwrapAttachment(depthStencilAttachment);
                    reglFramebuffer.width = framebuffer.width;
                    reglFramebuffer.height = framebuffer.height;
                    updateFramebuffer(framebuffer);
                    return reglFramebuffer;
                }
                function resize(w_, h_) {
                    check$1(framebufferState.next !== framebuffer, 'can not resize a framebuffer which is currently in use');
                    var w = Math.max(w_ | 0, 1);
                    var h = Math.max((h_ | 0) || w, 1);
                    if (w === framebuffer.width && h === framebuffer.height) {
                        return reglFramebuffer;
                    }
                    // resize all buffers
                    var colorAttachments = framebuffer.colorAttachments;
                    for (var i = 0; i < colorAttachments.length; ++i) {
                        resizeAttachment(colorAttachments[i], w, h);
                    }
                    resizeAttachment(framebuffer.depthAttachment, w, h);
                    resizeAttachment(framebuffer.stencilAttachment, w, h);
                    resizeAttachment(framebuffer.depthStencilAttachment, w, h);
                    framebuffer.width = reglFramebuffer.width = w;
                    framebuffer.height = reglFramebuffer.height = h;
                    updateFramebuffer(framebuffer);
                    return reglFramebuffer;
                }
                reglFramebuffer(a0, a1);
                return extend(reglFramebuffer, {
                    resize: resize,
                    _reglType: 'framebuffer',
                    _framebuffer: framebuffer,
                    destroy: function () {
                        destroy(framebuffer);
                        decFBORefs(framebuffer);
                    },
                    use: function (block) {
                        framebufferState.setFBO({
                            framebuffer: reglFramebuffer
                        }, block);
                    }
                });
            }
            function createCubeFBO(options) {
                var faces = Array(6);
                function reglFramebufferCube(a) {
                    var i;
                    check$1(faces.indexOf(framebufferState.next) < 0, 'can not update framebuffer which is currently in use');
                    var params = {
                        color: null
                    };
                    var radius = 0;
                    var colorBuffer = null;
                    var colorFormat = 'rgba';
                    var colorType = 'uint8';
                    var colorCount = 1;
                    if (typeof a === 'number') {
                        radius = a | 0;
                    }
                    else if (!a) {
                        radius = 1;
                    }
                    else {
                        check$1.type(a, 'object', 'invalid arguments for framebuffer');
                        var options = a;
                        if ('shape' in options) {
                            var shape = options.shape;
                            check$1(Array.isArray(shape) && shape.length >= 2, 'invalid shape for framebuffer');
                            check$1(shape[0] === shape[1], 'cube framebuffer must be square');
                            radius = shape[0];
                        }
                        else {
                            if ('radius' in options) {
                                radius = options.radius | 0;
                            }
                            if ('width' in options) {
                                radius = options.width | 0;
                                if ('height' in options) {
                                    check$1(options.height === radius, 'must be square');
                                }
                            }
                            else if ('height' in options) {
                                radius = options.height | 0;
                            }
                        }
                        if ('color' in options ||
                            'colors' in options) {
                            colorBuffer =
                                options.color ||
                                    options.colors;
                            if (Array.isArray(colorBuffer)) {
                                check$1(colorBuffer.length === 1 || extensions.webgl_draw_buffers, 'multiple render targets not supported');
                            }
                        }
                        if (!colorBuffer) {
                            if ('colorCount' in options) {
                                colorCount = options.colorCount | 0;
                                check$1(colorCount > 0, 'invalid color buffer count');
                            }
                            if ('colorType' in options) {
                                check$1.oneOf(options.colorType, colorTypes, 'invalid color type');
                                colorType = options.colorType;
                            }
                            if ('colorFormat' in options) {
                                colorFormat = options.colorFormat;
                                check$1.oneOf(options.colorFormat, colorTextureFormats, 'invalid color format for texture');
                            }
                        }
                        if ('depth' in options) {
                            params.depth = options.depth;
                        }
                        if ('stencil' in options) {
                            params.stencil = options.stencil;
                        }
                        if ('depthStencil' in options) {
                            params.depthStencil = options.depthStencil;
                        }
                    }
                    var colorCubes;
                    if (colorBuffer) {
                        if (Array.isArray(colorBuffer)) {
                            colorCubes = [];
                            for (i = 0; i < colorBuffer.length; ++i) {
                                colorCubes[i] = colorBuffer[i];
                            }
                        }
                        else {
                            colorCubes = [colorBuffer];
                        }
                    }
                    else {
                        colorCubes = Array(colorCount);
                        var cubeMapParams = {
                            radius: radius,
                            format: colorFormat,
                            type: colorType
                        };
                        for (i = 0; i < colorCount; ++i) {
                            colorCubes[i] = textureState.createCube(cubeMapParams);
                        }
                    }
                    // Check color cubes
                    params.color = Array(colorCubes.length);
                    for (i = 0; i < colorCubes.length; ++i) {
                        var cube = colorCubes[i];
                        check$1(typeof cube === 'function' && cube._reglType === 'textureCube', 'invalid cube map');
                        radius = radius || cube.width;
                        check$1(cube.width === radius && cube.height === radius, 'invalid cube map shape');
                        params.color[i] = {
                            target: GL_TEXTURE_CUBE_MAP_POSITIVE_X$2,
                            data: colorCubes[i]
                        };
                    }
                    for (i = 0; i < 6; ++i) {
                        for (var j = 0; j < colorCubes.length; ++j) {
                            params.color[j].target = GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + i;
                        }
                        // reuse depth-stencil attachments across all cube maps
                        if (i > 0) {
                            params.depth = faces[0].depth;
                            params.stencil = faces[0].stencil;
                            params.depthStencil = faces[0].depthStencil;
                        }
                        if (faces[i]) {
                            (faces[i])(params);
                        }
                        else {
                            faces[i] = createFBO(params);
                        }
                    }
                    return extend(reglFramebufferCube, {
                        width: radius,
                        height: radius,
                        color: colorCubes
                    });
                }
                function resize(radius_) {
                    var i;
                    var radius = radius_ | 0;
                    check$1(radius > 0 && radius <= limits.maxCubeMapSize, 'invalid radius for cube fbo');
                    if (radius === reglFramebufferCube.width) {
                        return reglFramebufferCube;
                    }
                    var colors = reglFramebufferCube.color;
                    for (i = 0; i < colors.length; ++i) {
                        colors[i].resize(radius);
                    }
                    for (i = 0; i < 6; ++i) {
                        faces[i].resize(radius);
                    }
                    reglFramebufferCube.width = reglFramebufferCube.height = radius;
                    return reglFramebufferCube;
                }
                reglFramebufferCube(options);
                return extend(reglFramebufferCube, {
                    faces: faces,
                    resize: resize,
                    _reglType: 'framebufferCube',
                    destroy: function () {
                        faces.forEach(function (f) {
                            f.destroy();
                        });
                    }
                });
            }
            function restoreFramebuffers() {
                framebufferState.cur = null;
                framebufferState.next = null;
                framebufferState.dirty = true;
                values(framebufferSet).forEach(function (fb) {
                    fb.framebuffer = gl.createFramebuffer();
                    updateFramebuffer(fb);
                });
            }
            return extend(framebufferState, {
                getFramebuffer: function (object) {
                    if (typeof object === 'function' && object._reglType === 'framebuffer') {
                        var fbo = object._framebuffer;
                        if (fbo instanceof REGLFramebuffer) {
                            return fbo;
                        }
                    }
                    return null;
                },
                create: createFBO,
                createCube: createCubeFBO,
                clear: function () {
                    values(framebufferSet).forEach(destroy);
                },
                restore: restoreFramebuffers
            });
        }
        var GL_FLOAT$6 = 5126;
        var GL_ARRAY_BUFFER$1 = 34962;
        var GL_ELEMENT_ARRAY_BUFFER$1 = 34963;
        var VAO_OPTIONS = [
            'attributes',
            'elements',
            'offset',
            'count',
            'primitive',
            'instances'
        ];
        function AttributeRecord() {
            this.state = 0;
            this.x = 0.0;
            this.y = 0.0;
            this.z = 0.0;
            this.w = 0.0;
            this.buffer = null;
            this.size = 0;
            this.normalized = false;
            this.type = GL_FLOAT$6;
            this.offset = 0;
            this.stride = 0;
            this.divisor = 0;
        }
        function wrapAttributeState(gl, extensions, limits, stats, bufferState, elementState, drawState) {
            var NUM_ATTRIBUTES = limits.maxAttributes;
            var attributeBindings = new Array(NUM_ATTRIBUTES);
            for (var i = 0; i < NUM_ATTRIBUTES; ++i) {
                attributeBindings[i] = new AttributeRecord();
            }
            var vaoCount = 0;
            var vaoSet = {};
            var state = {
                Record: AttributeRecord,
                scope: {},
                state: attributeBindings,
                currentVAO: null,
                targetVAO: null,
                restore: extVAO() ? restoreVAO : function () { },
                createVAO: createVAO,
                getVAO: getVAO,
                destroyBuffer: destroyBuffer,
                setVAO: extVAO() ? setVAOEXT : setVAOEmulated,
                clear: extVAO() ? destroyVAOEXT : function () { }
            };
            function destroyBuffer(buffer) {
                for (var i = 0; i < attributeBindings.length; ++i) {
                    var record = attributeBindings[i];
                    if (record.buffer === buffer) {
                        gl.disableVertexAttribArray(i);
                        record.buffer = null;
                    }
                }
            }
            function extVAO() {
                return extensions.oes_vertex_array_object;
            }
            function extInstanced() {
                return extensions.angle_instanced_arrays;
            }
            function getVAO(vao) {
                if (typeof vao === 'function' && vao._vao) {
                    return vao._vao;
                }
                return null;
            }
            function setVAOEXT(vao) {
                if (vao === state.currentVAO) {
                    return;
                }
                var ext = extVAO();
                if (vao) {
                    ext.bindVertexArrayOES(vao.vao);
                }
                else {
                    ext.bindVertexArrayOES(null);
                }
                state.currentVAO = vao;
            }
            function setVAOEmulated(vao) {
                if (vao === state.currentVAO) {
                    return;
                }
                if (vao) {
                    vao.bindAttrs();
                }
                else {
                    var exti = extInstanced();
                    for (var i = 0; i < attributeBindings.length; ++i) {
                        var binding = attributeBindings[i];
                        if (binding.buffer) {
                            gl.enableVertexAttribArray(i);
                            binding.buffer.bind();
                            gl.vertexAttribPointer(i, binding.size, binding.type, binding.normalized, binding.stride, binding.offfset);
                            if (exti && binding.divisor) {
                                exti.vertexAttribDivisorANGLE(i, binding.divisor);
                            }
                        }
                        else {
                            gl.disableVertexAttribArray(i);
                            gl.vertexAttrib4f(i, binding.x, binding.y, binding.z, binding.w);
                        }
                    }
                    if (drawState.elements) {
                        gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, drawState.elements.buffer.buffer);
                    }
                    else {
                        gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, null);
                    }
                }
                state.currentVAO = vao;
            }
            function destroyVAOEXT() {
                values(vaoSet).forEach(function (vao) {
                    vao.destroy();
                });
            }
            function REGLVAO() {
                this.id = ++vaoCount;
                this.attributes = [];
                this.elements = null;
                this.ownsElements = false;
                this.count = 0;
                this.offset = 0;
                this.instances = -1;
                this.primitive = 4;
                var extension = extVAO();
                if (extension) {
                    this.vao = extension.createVertexArrayOES();
                }
                else {
                    this.vao = null;
                }
                vaoSet[this.id] = this;
                this.buffers = [];
            }
            REGLVAO.prototype.bindAttrs = function () {
                var exti = extInstanced();
                var attributes = this.attributes;
                for (var i = 0; i < attributes.length; ++i) {
                    var attr = attributes[i];
                    if (attr.buffer) {
                        gl.enableVertexAttribArray(i);
                        gl.bindBuffer(GL_ARRAY_BUFFER$1, attr.buffer.buffer);
                        gl.vertexAttribPointer(i, attr.size, attr.type, attr.normalized, attr.stride, attr.offset);
                        if (exti && attr.divisor) {
                            exti.vertexAttribDivisorANGLE(i, attr.divisor);
                        }
                    }
                    else {
                        gl.disableVertexAttribArray(i);
                        gl.vertexAttrib4f(i, attr.x, attr.y, attr.z, attr.w);
                    }
                }
                for (var j = attributes.length; j < NUM_ATTRIBUTES; ++j) {
                    gl.disableVertexAttribArray(j);
                }
                var elements = elementState.getElements(this.elements);
                if (elements) {
                    gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, elements.buffer.buffer);
                }
                else {
                    gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, null);
                }
            };
            REGLVAO.prototype.refresh = function () {
                var ext = extVAO();
                if (ext) {
                    ext.bindVertexArrayOES(this.vao);
                    this.bindAttrs();
                    state.currentVAO = null;
                    ext.bindVertexArrayOES(null);
                }
            };
            REGLVAO.prototype.destroy = function () {
                if (this.vao) {
                    var extension = extVAO();
                    if (this === state.currentVAO) {
                        state.currentVAO = null;
                        extension.bindVertexArrayOES(null);
                    }
                    extension.deleteVertexArrayOES(this.vao);
                    this.vao = null;
                }
                if (this.ownsElements) {
                    this.elements.destroy();
                    this.elements = null;
                    this.ownsElements = false;
                }
                if (vaoSet[this.id]) {
                    delete vaoSet[this.id];
                    stats.vaoCount -= 1;
                }
            };
            function restoreVAO() {
                var ext = extVAO();
                if (ext) {
                    values(vaoSet).forEach(function (vao) {
                        vao.refresh();
                    });
                }
            }
            function createVAO(_attr) {
                var vao = new REGLVAO();
                stats.vaoCount += 1;
                function updateVAO(options) {
                    var attributes;
                    if (Array.isArray(options)) {
                        attributes = options;
                        if (vao.elements && vao.ownsElements) {
                            vao.elements.destroy();
                        }
                        vao.elements = null;
                        vao.ownsElements = false;
                        vao.offset = 0;
                        vao.count = 0;
                        vao.instances = -1;
                        vao.primitive = 4;
                    }
                    else {
                        check$1(typeof options === 'object', 'invalid arguments for create vao');
                        check$1('attributes' in options, 'must specify attributes for vao');
                        if (options.elements) {
                            var elements = options.elements;
                            if (vao.ownsElements) {
                                if (typeof elements === 'function' && elements._reglType === 'elements') {
                                    vao.elements.destroy();
                                    vao.ownsElements = false;
                                }
                                else {
                                    vao.elements(elements);
                                    vao.ownsElements = false;
                                }
                            }
                            else if (elementState.getElements(options.elements)) {
                                vao.elements = options.elements;
                                vao.ownsElements = false;
                            }
                            else {
                                vao.elements = elementState.create(options.elements);
                                vao.ownsElements = true;
                            }
                        }
                        else {
                            vao.elements = null;
                            vao.ownsElements = false;
                        }
                        attributes = options.attributes;
                        // set default vao
                        vao.offset = 0;
                        vao.count = -1;
                        vao.instances = -1;
                        vao.primitive = 4;
                        // copy element properties
                        if (vao.elements) {
                            vao.count = vao.elements._elements.vertCount;
                            vao.primitive = vao.elements._elements.primType;
                        }
                        if ('offset' in options) {
                            vao.offset = options.offset | 0;
                        }
                        if ('count' in options) {
                            vao.count = options.count | 0;
                        }
                        if ('instances' in options) {
                            vao.instances = options.instances | 0;
                        }
                        if ('primitive' in options) {
                            check$1(options.primitive in primTypes, 'bad primitive type: ' + options.primitive);
                            vao.primitive = primTypes[options.primitive];
                        }
                        check$1.optional(() => {
                            var keys = Object.keys(options);
                            for (var i = 0; i < keys.length; ++i) {
                                check$1(VAO_OPTIONS.indexOf(keys[i]) >= 0, 'invalid option for vao: "' + keys[i] + '" valid options are ' + VAO_OPTIONS);
                            }
                        });
                        check$1(Array.isArray(attributes), 'attributes must be an array');
                    }
                    check$1(attributes.length < NUM_ATTRIBUTES, 'too many attributes');
                    check$1(attributes.length > 0, 'must specify at least one attribute');
                    var bufUpdated = {};
                    var nattributes = vao.attributes;
                    nattributes.length = attributes.length;
                    for (var i = 0; i < attributes.length; ++i) {
                        var spec = attributes[i];
                        var rec = nattributes[i] = new AttributeRecord();
                        var data = spec.data || spec;
                        if (Array.isArray(data) || isTypedArray(data) || isNDArrayLike(data)) {
                            var buf;
                            if (vao.buffers[i]) {
                                buf = vao.buffers[i];
                                if (isTypedArray(data) && buf._buffer.byteLength >= data.byteLength) {
                                    buf.subdata(data);
                                }
                                else {
                                    buf.destroy();
                                    vao.buffers[i] = null;
                                }
                            }
                            if (!vao.buffers[i]) {
                                buf = vao.buffers[i] = bufferState.create(spec, GL_ARRAY_BUFFER$1, false, true);
                            }
                            rec.buffer = bufferState.getBuffer(buf);
                            rec.size = rec.buffer.dimension | 0;
                            rec.normalized = false;
                            rec.type = rec.buffer.dtype;
                            rec.offset = 0;
                            rec.stride = 0;
                            rec.divisor = 0;
                            rec.state = 1;
                            bufUpdated[i] = 1;
                        }
                        else if (bufferState.getBuffer(spec)) {
                            rec.buffer = bufferState.getBuffer(spec);
                            rec.size = rec.buffer.dimension | 0;
                            rec.normalized = false;
                            rec.type = rec.buffer.dtype;
                            rec.offset = 0;
                            rec.stride = 0;
                            rec.divisor = 0;
                            rec.state = 1;
                        }
                        else if (bufferState.getBuffer(spec.buffer)) {
                            rec.buffer = bufferState.getBuffer(spec.buffer);
                            rec.size = ((+spec.size) || rec.buffer.dimension) | 0;
                            rec.normalized = !!spec.normalized || false;
                            if ('type' in spec) {
                                check$1.parameter(spec.type, glTypes, 'invalid buffer type');
                                rec.type = glTypes[spec.type];
                            }
                            else {
                                rec.type = rec.buffer.dtype;
                            }
                            rec.offset = (spec.offset || 0) | 0;
                            rec.stride = (spec.stride || 0) | 0;
                            rec.divisor = (spec.divisor || 0) | 0;
                            rec.state = 1;
                            check$1(rec.size >= 1 && rec.size <= 4, 'size must be between 1 and 4');
                            check$1(rec.offset >= 0, 'invalid offset');
                            check$1(rec.stride >= 0 && rec.stride <= 255, 'stride must be between 0 and 255');
                            check$1(rec.divisor >= 0, 'divisor must be positive');
                            check$1(!rec.divisor || !!extensions.angle_instanced_arrays, 'ANGLE_instanced_arrays must be enabled to use divisor');
                        }
                        else if ('x' in spec) {
                            check$1(i > 0, 'first attribute must not be a constant');
                            rec.x = +spec.x || 0;
                            rec.y = +spec.y || 0;
                            rec.z = +spec.z || 0;
                            rec.w = +spec.w || 0;
                            rec.state = 2;
                        }
                        else {
                            check$1(false, 'invalid attribute spec for location ' + i);
                        }
                    }
                    // retire unused buffers
                    for (var j = 0; j < vao.buffers.length; ++j) {
                        if (!bufUpdated[j] && vao.buffers[j]) {
                            vao.buffers[j].destroy();
                            vao.buffers[j] = null;
                        }
                    }
                    vao.refresh();
                    return updateVAO;
                }
                updateVAO.destroy = function () {
                    for (var j = 0; j < vao.buffers.length; ++j) {
                        if (vao.buffers[j]) {
                            vao.buffers[j].destroy();
                        }
                    }
                    vao.buffers.length = 0;
                    if (vao.ownsElements) {
                        vao.elements.destroy();
                        vao.elements = null;
                        vao.ownsElements = false;
                    }
                    vao.destroy();
                };
                updateVAO._vao = vao;
                updateVAO._reglType = 'vao';
                return updateVAO(_attr);
            }
            return state;
        }
        var GL_FRAGMENT_SHADER = 35632;
        var GL_VERTEX_SHADER = 35633;
        var GL_ACTIVE_UNIFORMS = 0x8B86;
        var GL_ACTIVE_ATTRIBUTES = 0x8B89;
        function wrapShaderState(gl, stringStore, stats, config) {
            // ===================================================
            // glsl compilation and linking
            // ===================================================
            var fragShaders = {};
            var vertShaders = {};
            function ActiveInfo(name, id, location, info) {
                this.name = name;
                this.id = id;
                this.location = location;
                this.info = info;
            }
            function insertActiveInfo(list, info) {
                for (var i = 0; i < list.length; ++i) {
                    if (list[i].id === info.id) {
                        list[i].location = info.location;
                        return;
                    }
                }
                list.push(info);
            }
            function getShader(type, id, command) {
                var cache = type === GL_FRAGMENT_SHADER ? fragShaders : vertShaders;
                var shader = cache[id];
                if (!shader) {
                    var source = stringStore.str(id);
                    shader = gl.createShader(type);
                    gl.shaderSource(shader, source);
                    gl.compileShader(shader);
                    check$1.shaderError(gl, shader, source, type, command);
                    cache[id] = shader;
                }
                return shader;
            }
            // ===================================================
            // program linking
            // ===================================================
            var programCache = {};
            var programList = [];
            var PROGRAM_COUNTER = 0;
            function REGLProgram(fragId, vertId) {
                this.id = PROGRAM_COUNTER++;
                this.fragId = fragId;
                this.vertId = vertId;
                this.program = null;
                this.uniforms = [];
                this.attributes = [];
                this.refCount = 1;
                if (config.profile) {
                    this.stats = {
                        uniformsCount: 0,
                        attributesCount: 0
                    };
                }
            }
            function linkProgram(desc, command, attributeLocations) {
                var i, info;
                // -------------------------------
                // compile & link
                // -------------------------------
                var fragShader = getShader(GL_FRAGMENT_SHADER, desc.fragId);
                var vertShader = getShader(GL_VERTEX_SHADER, desc.vertId);
                var program = desc.program = gl.createProgram();
                gl.attachShader(program, fragShader);
                gl.attachShader(program, vertShader);
                if (attributeLocations) {
                    for (i = 0; i < attributeLocations.length; ++i) {
                        var binding = attributeLocations[i];
                        gl.bindAttribLocation(program, binding[0], binding[1]);
                    }
                }
                gl.linkProgram(program);
                check$1.linkError(gl, program, stringStore.str(desc.fragId), stringStore.str(desc.vertId), command);
                // -------------------------------
                // grab uniforms
                // -------------------------------
                var numUniforms = gl.getProgramParameter(program, GL_ACTIVE_UNIFORMS);
                if (config.profile) {
                    desc.stats.uniformsCount = numUniforms;
                }
                var uniforms = desc.uniforms;
                for (i = 0; i < numUniforms; ++i) {
                    info = gl.getActiveUniform(program, i);
                    if (info) {
                        if (info.size > 1) {
                            for (var j = 0; j < info.size; ++j) {
                                var name = info.name.replace('[0]', '[' + j + ']');
                                insertActiveInfo(uniforms, new ActiveInfo(name, stringStore.id(name), gl.getUniformLocation(program, name), info));
                            }
                        }
                        var uniName = info.name;
                        if (info.size > 1) {
                            uniName = uniName.replace('[0]', '');
                        }
                        insertActiveInfo(uniforms, new ActiveInfo(uniName, stringStore.id(uniName), gl.getUniformLocation(program, uniName), info));
                    }
                }
                // -------------------------------
                // grab attributes
                // -------------------------------
                var numAttributes = gl.getProgramParameter(program, GL_ACTIVE_ATTRIBUTES);
                if (config.profile) {
                    desc.stats.attributesCount = numAttributes;
                }
                var attributes = desc.attributes;
                for (i = 0; i < numAttributes; ++i) {
                    info = gl.getActiveAttrib(program, i);
                    if (info) {
                        insertActiveInfo(attributes, new ActiveInfo(info.name, stringStore.id(info.name), gl.getAttribLocation(program, info.name), info));
                    }
                }
            }
            if (config.profile) {
                stats.getMaxUniformsCount = function () {
                    var m = 0;
                    programList.forEach(function (desc) {
                        if (desc.stats.uniformsCount > m) {
                            m = desc.stats.uniformsCount;
                        }
                    });
                    return m;
                };
                stats.getMaxAttributesCount = function () {
                    var m = 0;
                    programList.forEach(function (desc) {
                        if (desc.stats.attributesCount > m) {
                            m = desc.stats.attributesCount;
                        }
                    });
                    return m;
                };
            }
            function restoreShaders() {
                fragShaders = {};
                vertShaders = {};
                for (var i = 0; i < programList.length; ++i) {
                    linkProgram(programList[i], null, programList[i].attributes.map(function (info) {
                        return [info.location, info.name];
                    }));
                }
            }
            return {
                clear: function () {
                    var deleteShader = gl.deleteShader.bind(gl);
                    values(fragShaders).forEach(deleteShader);
                    fragShaders = {};
                    values(vertShaders).forEach(deleteShader);
                    vertShaders = {};
                    programList.forEach(function (desc) {
                        gl.deleteProgram(desc.program);
                    });
                    programList.length = 0;
                    programCache = {};
                    stats.shaderCount = 0;
                },
                program: function (vertId, fragId, command, attribLocations) {
                    check$1.command(vertId >= 0, 'missing vertex shader', command);
                    check$1.command(fragId >= 0, 'missing fragment shader', command);
                    var cache = programCache[fragId];
                    if (!cache) {
                        cache = programCache[fragId] = {};
                    }
                    var prevProgram = cache[vertId];
                    if (prevProgram) {
                        prevProgram.refCount++;
                        if (!attribLocations) {
                            return prevProgram;
                        }
                    }
                    var program = new REGLProgram(fragId, vertId);
                    stats.shaderCount++;
                    linkProgram(program, command, attribLocations);
                    if (!prevProgram) {
                        cache[vertId] = program;
                    }
                    programList.push(program);
                    return extend(program, {
                        destroy: function () {
                            program.refCount--;
                            if (program.refCount <= 0) {
                                gl.deleteProgram(program.program);
                                var idx = programList.indexOf(program);
                                programList.splice(idx, 1);
                                stats.shaderCount--;
                            }
                            // no program is linked to this vert anymore
                            if (cache[program.vertId].refCount <= 0) {
                                gl.deleteShader(vertShaders[program.vertId]);
                                delete vertShaders[program.vertId];
                                delete programCache[program.fragId][program.vertId];
                            }
                            // no program is linked to this frag anymore
                            if (!Object.keys(programCache[program.fragId]).length) {
                                gl.deleteShader(fragShaders[program.fragId]);
                                delete fragShaders[program.fragId];
                                delete programCache[program.fragId];
                            }
                        }
                    });
                },
                restore: restoreShaders,
                shader: getShader,
                frag: -1,
                vert: -1
            };
        }
        var GL_RGBA$3 = 6408;
        var GL_UNSIGNED_BYTE$7 = 5121;
        var GL_PACK_ALIGNMENT = 0x0D05;
        var GL_FLOAT$7 = 0x1406; // 5126
        function wrapReadPixels(gl, framebufferState, reglPoll, context, glAttributes, extensions, limits) {
            function readPixelsImpl(input) {
                var type;
                if (framebufferState.next === null) {
                    check$1(glAttributes.preserveDrawingBuffer, 'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer');
                    type = GL_UNSIGNED_BYTE$7;
                }
                else {
                    check$1(framebufferState.next.colorAttachments[0].texture !== null, 'You cannot read from a renderbuffer');
                    type = framebufferState.next.colorAttachments[0].texture._texture.type;
                    check$1.optional(function () {
                        if (extensions.oes_texture_float) {
                            check$1(type === GL_UNSIGNED_BYTE$7 || type === GL_FLOAT$7, 'Reading from a framebuffer is only allowed for the types \'uint8\' and \'float\'');
                            if (type === GL_FLOAT$7) {
                                check$1(limits.readFloat, 'Reading \'float\' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float');
                            }
                        }
                        else {
                            check$1(type === GL_UNSIGNED_BYTE$7, 'Reading from a framebuffer is only allowed for the type \'uint8\'');
                        }
                    });
                }
                var x = 0;
                var y = 0;
                var width = context.framebufferWidth;
                var height = context.framebufferHeight;
                var data = null;
                if (isTypedArray(input)) {
                    data = input;
                }
                else if (input) {
                    check$1.type(input, 'object', 'invalid arguments to regl.read()');
                    x = input.x | 0;
                    y = input.y | 0;
                    check$1(x >= 0 && x < context.framebufferWidth, 'invalid x offset for regl.read');
                    check$1(y >= 0 && y < context.framebufferHeight, 'invalid y offset for regl.read');
                    width = (input.width || (context.framebufferWidth - x)) | 0;
                    height = (input.height || (context.framebufferHeight - y)) | 0;
                    data = input.data || null;
                }
                // sanity check input.data
                if (data) {
                    if (type === GL_UNSIGNED_BYTE$7) {
                        check$1(data instanceof Uint8Array, 'buffer must be \'Uint8Array\' when reading from a framebuffer of type \'uint8\'');
                    }
                    else if (type === GL_FLOAT$7) {
                        check$1(data instanceof Float32Array, 'buffer must be \'Float32Array\' when reading from a framebuffer of type \'float\'');
                    }
                }
                check$1(width > 0 && width + x <= context.framebufferWidth, 'invalid width for read pixels');
                check$1(height > 0 && height + y <= context.framebufferHeight, 'invalid height for read pixels');
                // Update WebGL state
                reglPoll();
                // Compute size
                var size = width * height * 4;
                // Allocate data
                if (!data) {
                    if (type === GL_UNSIGNED_BYTE$7) {
                        data = new Uint8Array(size);
                    }
                    else if (type === GL_FLOAT$7) {
                        data = data || new Float32Array(size);
                    }
                }
                // Type check
                check$1.isTypedArray(data, 'data buffer for regl.read() must be a typedarray');
                check$1(data.byteLength >= size, 'data buffer for regl.read() too small');
                // Run read pixels
                gl.pixelStorei(GL_PACK_ALIGNMENT, 4);
                gl.readPixels(x, y, width, height, GL_RGBA$3, type, data);
                return data;
            }
            function readPixelsFBO(options) {
                var result;
                framebufferState.setFBO({
                    framebuffer: options.framebuffer
                }, function () {
                    result = readPixelsImpl(options);
                });
                return result;
            }
            function readPixels(options) {
                if (!options || !('framebuffer' in options)) {
                    return readPixelsImpl(options);
                }
                else {
                    return readPixelsFBO(options);
                }
            }
            return readPixels;
        }
        function slice(x) {
            return Array.prototype.slice.call(x);
        }
        function join(x) {
            return slice(x).join('');
        }
        function createEnvironment() {
            // Unique variable id counter
            var varCounter = 0;
            // Linked values are passed from this scope into the generated code block
            // Calling link() passes a value into the generated scope and returns
            // the variable name which it is bound to
            var linkedNames = [];
            var linkedValues = [];
            function link(value) {
                for (var i = 0; i < linkedValues.length; ++i) {
                    if (linkedValues[i] === value) {
                        return linkedNames[i];
                    }
                }
                var name = 'g' + (varCounter++);
                linkedNames.push(name);
                linkedValues.push(value);
                return name;
            }
            // create a code block
            function block() {
                var code = [];
                function push() {
                    code.push.apply(code, slice(arguments));
                }
                var vars = [];
                function def() {
                    var name = 'v' + (varCounter++);
                    vars.push(name);
                    if (arguments.length > 0) {
                        code.push(name, '=');
                        code.push.apply(code, slice(arguments));
                        code.push(';');
                    }
                    return name;
                }
                return extend(push, {
                    def: def,
                    toString: function () {
                        return join([
                            (vars.length > 0 ? 'var ' + vars.join(',') + ';' : ''),
                            join(code)
                        ]);
                    }
                });
            }
            function scope() {
                var entry = block();
                var exit = block();
                var entryToString = entry.toString;
                var exitToString = exit.toString;
                function save(object, prop) {
                    exit(object, prop, '=', entry.def(object, prop), ';');
                }
                return extend(function () {
                    entry.apply(entry, slice(arguments));
                }, {
                    def: entry.def,
                    entry: entry,
                    exit: exit,
                    save: save,
                    set: function (object, prop, value) {
                        save(object, prop);
                        entry(object, prop, '=', value, ';');
                    },
                    toString: function () {
                        return entryToString() + exitToString();
                    }
                });
            }
            function conditional() {
                var pred = join(arguments);
                var thenBlock = scope();
                var elseBlock = scope();
                var thenToString = thenBlock.toString;
                var elseToString = elseBlock.toString;
                return extend(thenBlock, {
                    then: function () {
                        thenBlock.apply(thenBlock, slice(arguments));
                        return this;
                    },
                    else: function () {
                        elseBlock.apply(elseBlock, slice(arguments));
                        return this;
                    },
                    toString: function () {
                        var elseClause = elseToString();
                        if (elseClause) {
                            elseClause = 'else{' + elseClause + '}';
                        }
                        return join([
                            'if(', pred, '){',
                            thenToString(),
                            '}', elseClause
                        ]);
                    }
                });
            }
            // procedure list
            var globalBlock = block();
            var procedures = {};
            function proc(name, count) {
                var args = [];
                function arg() {
                    var name = 'a' + args.length;
                    args.push(name);
                    return name;
                }
                count = count || 0;
                for (var i = 0; i < count; ++i) {
                    arg();
                }
                var body = scope();
                var bodyToString = body.toString;
                var result = procedures[name] = extend(body, {
                    arg: arg,
                    toString: function () {
                        return join([
                            'function(', args.join(), '){',
                            bodyToString(),
                            '}'
                        ]);
                    }
                });
                return result;
            }
            function compile() {
                var code = ['"use strict";',
                    globalBlock,
                    'return {'];
                Object.keys(procedures).forEach(function (name) {
                    code.push('"', name, '":', procedures[name].toString(), ',');
                });
                code.push('}');
                var src = join(code)
                    .replace(/;/g, ';\n')
                    .replace(/}/g, '}\n')
                    .replace(/{/g, '{\n');
                var proc = Function.apply(null, linkedNames.concat(src));
                return proc.apply(null, linkedValues);
            }
            return {
                global: globalBlock,
                link: link,
                block: block,
                proc: proc,
                scope: scope,
                cond: conditional,
                compile: compile
            };
        }
        // "cute" names for vector components
        var CUTE_COMPONENTS = 'xyzw'.split('');
        var GL_UNSIGNED_BYTE$8 = 5121;
        var ATTRIB_STATE_POINTER = 1;
        var ATTRIB_STATE_CONSTANT = 2;
        var DYN_FUNC$1 = 0;
        var DYN_PROP$1 = 1;
        var DYN_CONTEXT$1 = 2;
        var DYN_STATE$1 = 3;
        var DYN_THUNK = 4;
        var DYN_CONSTANT$1 = 5;
        var DYN_ARRAY$1 = 6;
        var S_DITHER = 'dither';
        var S_BLEND_ENABLE = 'blend.enable';
        var S_BLEND_COLOR = 'blend.color';
        var S_BLEND_EQUATION = 'blend.equation';
        var S_BLEND_FUNC = 'blend.func';
        var S_DEPTH_ENABLE = 'depth.enable';
        var S_DEPTH_FUNC = 'depth.func';
        var S_DEPTH_RANGE = 'depth.range';
        var S_DEPTH_MASK = 'depth.mask';
        var S_COLOR_MASK = 'colorMask';
        var S_CULL_ENABLE = 'cull.enable';
        var S_CULL_FACE = 'cull.face';
        var S_FRONT_FACE = 'frontFace';
        var S_LINE_WIDTH = 'lineWidth';
        var S_POLYGON_OFFSET_ENABLE = 'polygonOffset.enable';
        var S_POLYGON_OFFSET_OFFSET = 'polygonOffset.offset';
        var S_SAMPLE_ALPHA = 'sample.alpha';
        var S_SAMPLE_ENABLE = 'sample.enable';
        var S_SAMPLE_COVERAGE = 'sample.coverage';
        var S_STENCIL_ENABLE = 'stencil.enable';
        var S_STENCIL_MASK = 'stencil.mask';
        var S_STENCIL_FUNC = 'stencil.func';
        var S_STENCIL_OPFRONT = 'stencil.opFront';
        var S_STENCIL_OPBACK = 'stencil.opBack';
        var S_SCISSOR_ENABLE = 'scissor.enable';
        var S_SCISSOR_BOX = 'scissor.box';
        var S_VIEWPORT = 'viewport';
        var S_PROFILE = 'profile';
        var S_FRAMEBUFFER = 'framebuffer';
        var S_VERT = 'vert';
        var S_FRAG = 'frag';
        var S_ELEMENTS = 'elements';
        var S_PRIMITIVE = 'primitive';
        var S_COUNT = 'count';
        var S_OFFSET = 'offset';
        var S_INSTANCES = 'instances';
        var S_VAO = 'vao';
        var SUFFIX_WIDTH = 'Width';
        var SUFFIX_HEIGHT = 'Height';
        var S_FRAMEBUFFER_WIDTH = S_FRAMEBUFFER + SUFFIX_WIDTH;
        var S_FRAMEBUFFER_HEIGHT = S_FRAMEBUFFER + SUFFIX_HEIGHT;
        var S_VIEWPORT_WIDTH = S_VIEWPORT + SUFFIX_WIDTH;
        var S_VIEWPORT_HEIGHT = S_VIEWPORT + SUFFIX_HEIGHT;
        var S_DRAWINGBUFFER = 'drawingBuffer';
        var S_DRAWINGBUFFER_WIDTH = S_DRAWINGBUFFER + SUFFIX_WIDTH;
        var S_DRAWINGBUFFER_HEIGHT = S_DRAWINGBUFFER + SUFFIX_HEIGHT;
        var NESTED_OPTIONS = [
            S_BLEND_FUNC,
            S_BLEND_EQUATION,
            S_STENCIL_FUNC,
            S_STENCIL_OPFRONT,
            S_STENCIL_OPBACK,
            S_SAMPLE_COVERAGE,
            S_VIEWPORT,
            S_SCISSOR_BOX,
            S_POLYGON_OFFSET_OFFSET
        ];
        var GL_ARRAY_BUFFER$2 = 34962;
        var GL_ELEMENT_ARRAY_BUFFER$2 = 34963;
        var GL_FRAGMENT_SHADER$1 = 35632;
        var GL_VERTEX_SHADER$1 = 35633;
        var GL_TEXTURE_2D$3 = 0x0DE1;
        var GL_TEXTURE_CUBE_MAP$2 = 0x8513;
        var GL_CULL_FACE = 0x0B44;
        var GL_BLEND = 0x0BE2;
        var GL_DITHER = 0x0BD0;
        var GL_STENCIL_TEST = 0x0B90;
        var GL_DEPTH_TEST = 0x0B71;
        var GL_SCISSOR_TEST = 0x0C11;
        var GL_POLYGON_OFFSET_FILL = 0x8037;
        var GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
        var GL_SAMPLE_COVERAGE = 0x80A0;
        var GL_FLOAT$8 = 5126;
        var GL_FLOAT_VEC2 = 35664;
        var GL_FLOAT_VEC3 = 35665;
        var GL_FLOAT_VEC4 = 35666;
        var GL_INT$3 = 5124;
        var GL_INT_VEC2 = 35667;
        var GL_INT_VEC3 = 35668;
        var GL_INT_VEC4 = 35669;
        var GL_BOOL = 35670;
        var GL_BOOL_VEC2 = 35671;
        var GL_BOOL_VEC3 = 35672;
        var GL_BOOL_VEC4 = 35673;
        var GL_FLOAT_MAT2 = 35674;
        var GL_FLOAT_MAT3 = 35675;
        var GL_FLOAT_MAT4 = 35676;
        var GL_SAMPLER_2D = 35678;
        var GL_SAMPLER_CUBE = 35680;
        var GL_TRIANGLES$1 = 4;
        var GL_FRONT = 1028;
        var GL_BACK = 1029;
        var GL_CW = 0x0900;
        var GL_CCW = 0x0901;
        var GL_MIN_EXT = 0x8007;
        var GL_MAX_EXT = 0x8008;
        var GL_ALWAYS = 519;
        var GL_KEEP = 7680;
        var GL_ZERO = 0;
        var GL_ONE = 1;
        var GL_FUNC_ADD = 0x8006;
        var GL_LESS = 513;
        var GL_FRAMEBUFFER$2 = 0x8D40;
        var GL_COLOR_ATTACHMENT0$2 = 0x8CE0;
        var blendFuncs = {
            '0': 0,
            '1': 1,
            'zero': 0,
            'one': 1,
            'src color': 768,
            'one minus src color': 769,
            'src alpha': 770,
            'one minus src alpha': 771,
            'dst color': 774,
            'one minus dst color': 775,
            'dst alpha': 772,
            'one minus dst alpha': 773,
            'constant color': 32769,
            'one minus constant color': 32770,
            'constant alpha': 32771,
            'one minus constant alpha': 32772,
            'src alpha saturate': 776
        };
        // There are invalid values for srcRGB and dstRGB. See:
        // https://www.khronos.org/registry/webgl/specs/1.0/#6.13
        // https://github.com/KhronosGroup/WebGL/blob/0d3201f5f7ec3c0060bc1f04077461541f1987b9/conformance-suites/1.0.3/conformance/misc/webgl-specific.html#L56
        var invalidBlendCombinations = [
            'constant color, constant alpha',
            'one minus constant color, constant alpha',
            'constant color, one minus constant alpha',
            'one minus constant color, one minus constant alpha',
            'constant alpha, constant color',
            'constant alpha, one minus constant color',
            'one minus constant alpha, constant color',
            'one minus constant alpha, one minus constant color'
        ];
        var compareFuncs = {
            'never': 512,
            'less': 513,
            '<': 513,
            'equal': 514,
            '=': 514,
            '==': 514,
            '===': 514,
            'lequal': 515,
            '<=': 515,
            'greater': 516,
            '>': 516,
            'notequal': 517,
            '!=': 517,
            '!==': 517,
            'gequal': 518,
            '>=': 518,
            'always': 519
        };
        var stencilOps = {
            '0': 0,
            'zero': 0,
            'keep': 7680,
            'replace': 7681,
            'increment': 7682,
            'decrement': 7683,
            'increment wrap': 34055,
            'decrement wrap': 34056,
            'invert': 5386
        };
        var shaderType = {
            'frag': GL_FRAGMENT_SHADER$1,
            'vert': GL_VERTEX_SHADER$1
        };
        var orientationType = {
            'cw': GL_CW,
            'ccw': GL_CCW
        };
        function isBufferArgs(x) {
            return Array.isArray(x) ||
                isTypedArray(x) ||
                isNDArrayLike(x);
        }
        // Make sure viewport is processed first
        function sortState(state) {
            return state.sort(function (a, b) {
                if (a === S_VIEWPORT) {
                    return -1;
                }
                else if (b === S_VIEWPORT) {
                    return 1;
                }
                return (a < b) ? -1 : 1;
            });
        }
        function Declaration(thisDep, contextDep, propDep, append) {
            this.thisDep = thisDep;
            this.contextDep = contextDep;
            this.propDep = propDep;
            this.append = append;
        }
        function isStatic(decl) {
            return decl && !(decl.thisDep || decl.contextDep || decl.propDep);
        }
        function createStaticDecl(append) {
            return new Declaration(false, false, false, append);
        }
        function createDynamicDecl(dyn, append) {
            var type = dyn.type;
            if (type === DYN_FUNC$1) {
                var numArgs = dyn.data.length;
                return new Declaration(true, numArgs >= 1, numArgs >= 2, append);
            }
            else if (type === DYN_THUNK) {
                var data = dyn.data;
                return new Declaration(data.thisDep, data.contextDep, data.propDep, append);
            }
            else if (type === DYN_CONSTANT$1) {
                return new Declaration(false, false, false, append);
            }
            else if (type === DYN_ARRAY$1) {
                var thisDep = false;
                var contextDep = false;
                var propDep = false;
                for (var i = 0; i < dyn.data.length; ++i) {
                    var subDyn = dyn.data[i];
                    if (subDyn.type === DYN_PROP$1) {
                        propDep = true;
                    }
                    else if (subDyn.type === DYN_CONTEXT$1) {
                        contextDep = true;
                    }
                    else if (subDyn.type === DYN_STATE$1) {
                        thisDep = true;
                    }
                    else if (subDyn.type === DYN_FUNC$1) {
                        thisDep = true;
                        var subArgs = subDyn.data;
                        if (subArgs >= 1) {
                            contextDep = true;
                        }
                        if (subArgs >= 2) {
                            propDep = true;
                        }
                    }
                    else if (subDyn.type === DYN_THUNK) {
                        thisDep = thisDep || subDyn.data.thisDep;
                        contextDep = contextDep || subDyn.data.contextDep;
                        propDep = propDep || subDyn.data.propDep;
                    }
                }
                return new Declaration(thisDep, contextDep, propDep, append);
            }
            else {
                return new Declaration(type === DYN_STATE$1, type === DYN_CONTEXT$1, type === DYN_PROP$1, append);
            }
        }
        var SCOPE_DECL = new Declaration(false, false, false, function () { });
        function reglCore(gl, stringStore, extensions, limits, bufferState, elementState, textureState, framebufferState, uniformState, attributeState, shaderState, drawState, contextState, timer, config) {
            var AttributeRecord = attributeState.Record;
            var blendEquations = {
                'add': 32774,
                'subtract': 32778,
                'reverse subtract': 32779
            };
            if (extensions.ext_blend_minmax) {
                blendEquations.min = GL_MIN_EXT;
                blendEquations.max = GL_MAX_EXT;
            }
            var extInstancing = extensions.angle_instanced_arrays;
            var extDrawBuffers = extensions.webgl_draw_buffers;
            var extVertexArrays = extensions.oes_vertex_array_object;
            // ===================================================
            // ===================================================
            // WEBGL STATE
            // ===================================================
            // ===================================================
            var currentState = {
                dirty: true,
                profile: config.profile
            };
            var nextState = {};
            var GL_STATE_NAMES = [];
            var GL_FLAGS = {};
            var GL_VARIABLES = {};
            function propName(name) {
                return name.replace('.', '_');
            }
            function stateFlag(sname, cap, init) {
                var name = propName(sname);
                GL_STATE_NAMES.push(sname);
                nextState[name] = currentState[name] = !!init;
                GL_FLAGS[name] = cap;
            }
            function stateVariable(sname, func, init) {
                var name = propName(sname);
                GL_STATE_NAMES.push(sname);
                if (Array.isArray(init)) {
                    currentState[name] = init.slice();
                    nextState[name] = init.slice();
                }
                else {
                    currentState[name] = nextState[name] = init;
                }
                GL_VARIABLES[name] = func;
            }
            // Dithering
            stateFlag(S_DITHER, GL_DITHER);
            // Blending
            stateFlag(S_BLEND_ENABLE, GL_BLEND);
            stateVariable(S_BLEND_COLOR, 'blendColor', [0, 0, 0, 0]);
            stateVariable(S_BLEND_EQUATION, 'blendEquationSeparate', [GL_FUNC_ADD, GL_FUNC_ADD]);
            stateVariable(S_BLEND_FUNC, 'blendFuncSeparate', [GL_ONE, GL_ZERO, GL_ONE, GL_ZERO]);
            // Depth
            stateFlag(S_DEPTH_ENABLE, GL_DEPTH_TEST, true);
            stateVariable(S_DEPTH_FUNC, 'depthFunc', GL_LESS);
            stateVariable(S_DEPTH_RANGE, 'depthRange', [0, 1]);
            stateVariable(S_DEPTH_MASK, 'depthMask', true);
            // Color mask
            stateVariable(S_COLOR_MASK, S_COLOR_MASK, [true, true, true, true]);
            // Face culling
            stateFlag(S_CULL_ENABLE, GL_CULL_FACE);
            stateVariable(S_CULL_FACE, 'cullFace', GL_BACK);
            // Front face orientation
            stateVariable(S_FRONT_FACE, S_FRONT_FACE, GL_CCW);
            // Line width
            stateVariable(S_LINE_WIDTH, S_LINE_WIDTH, 1);
            // Polygon offset
            stateFlag(S_POLYGON_OFFSET_ENABLE, GL_POLYGON_OFFSET_FILL);
            stateVariable(S_POLYGON_OFFSET_OFFSET, 'polygonOffset', [0, 0]);
            // Sample coverage
            stateFlag(S_SAMPLE_ALPHA, GL_SAMPLE_ALPHA_TO_COVERAGE);
            stateFlag(S_SAMPLE_ENABLE, GL_SAMPLE_COVERAGE);
            stateVariable(S_SAMPLE_COVERAGE, 'sampleCoverage', [1, false]);
            // Stencil
            stateFlag(S_STENCIL_ENABLE, GL_STENCIL_TEST);
            stateVariable(S_STENCIL_MASK, 'stencilMask', -1);
            stateVariable(S_STENCIL_FUNC, 'stencilFunc', [GL_ALWAYS, 0, -1]);
            stateVariable(S_STENCIL_OPFRONT, 'stencilOpSeparate', [GL_FRONT, GL_KEEP, GL_KEEP, GL_KEEP]);
            stateVariable(S_STENCIL_OPBACK, 'stencilOpSeparate', [GL_BACK, GL_KEEP, GL_KEEP, GL_KEEP]);
            // Scissor
            stateFlag(S_SCISSOR_ENABLE, GL_SCISSOR_TEST);
            stateVariable(S_SCISSOR_BOX, 'scissor', [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);
            // Viewport
            stateVariable(S_VIEWPORT, S_VIEWPORT, [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);
            // ===================================================
            // ===================================================
            // ENVIRONMENT
            // ===================================================
            // ===================================================
            var sharedState = {
                gl: gl,
                context: contextState,
                strings: stringStore,
                next: nextState,
                current: currentState,
                draw: drawState,
                elements: elementState,
                buffer: bufferState,
                shader: shaderState,
                attributes: attributeState.state,
                vao: attributeState,
                uniforms: uniformState,
                framebuffer: framebufferState,
                extensions: extensions,
                timer: timer,
                isBufferArgs: isBufferArgs
            };
            var sharedConstants = {
                primTypes: primTypes,
                compareFuncs: compareFuncs,
                blendFuncs: blendFuncs,
                blendEquations: blendEquations,
                stencilOps: stencilOps,
                glTypes: glTypes,
                orientationType: orientationType
            };
            check$1.optional(function () {
                sharedState.isArrayLike = isArrayLike;
            });
            if (extDrawBuffers) {
                sharedConstants.backBuffer = [GL_BACK];
                sharedConstants.drawBuffer = loop(limits.maxDrawbuffers, function (i) {
                    if (i === 0) {
                        return [0];
                    }
                    return loop(i, function (j) {
                        return GL_COLOR_ATTACHMENT0$2 + j;
                    });
                });
            }
            var drawCallCounter = 0;
            function createREGLEnvironment() {
                var env = createEnvironment();
                var link = env.link;
                var global = env.global;
                env.id = drawCallCounter++;
                env.batchId = '0';
                // link shared state
                var SHARED = link(sharedState);
                var shared = env.shared = {
                    props: 'a0'
                };
                Object.keys(sharedState).forEach(function (prop) {
                    shared[prop] = global.def(SHARED, '.', prop);
                });
                // Inject runtime assertion stuff for debug builds
                check$1.optional(function () {
                    env.CHECK = link(check$1);
                    env.commandStr = check$1.guessCommand();
                    env.command = link(env.commandStr);
                    env.assert = function (block, pred, message) {
                        block('if(!(', pred, '))', this.CHECK, '.commandRaise(', link(message), ',', this.command, ');');
                    };
                    sharedConstants.invalidBlendCombinations = invalidBlendCombinations;
                });
                // Copy GL state variables over
                var nextVars = env.next = {};
                var currentVars = env.current = {};
                Object.keys(GL_VARIABLES).forEach(function (variable) {
                    if (Array.isArray(currentState[variable])) {
                        nextVars[variable] = global.def(shared.next, '.', variable);
                        currentVars[variable] = global.def(shared.current, '.', variable);
                    }
                });
                // Initialize shared constants
                var constants = env.constants = {};
                Object.keys(sharedConstants).forEach(function (name) {
                    constants[name] = global.def(JSON.stringify(sharedConstants[name]));
                });
                // Helper function for calling a block
                env.invoke = function (block, x) {
                    switch (x.type) {
                        case DYN_FUNC$1:
                            var argList = [
                                'this',
                                shared.context,
                                shared.props,
                                env.batchId
                            ];
                            return block.def(link(x.data), '.call(', argList.slice(0, Math.max(x.data.length + 1, 4)), ')');
                        case DYN_PROP$1:
                            return block.def(shared.props, x.data);
                        case DYN_CONTEXT$1:
                            return block.def(shared.context, x.data);
                        case DYN_STATE$1:
                            return block.def('this', x.data);
                        case DYN_THUNK:
                            x.data.append(env, block);
                            return x.data.ref;
                        case DYN_CONSTANT$1:
                            return x.data.toString();
                        case DYN_ARRAY$1:
                            return x.data.map(function (y) {
                                return env.invoke(block, y);
                            });
                    }
                };
                env.attribCache = {};
                var scopeAttribs = {};
                env.scopeAttrib = function (name) {
                    var id = stringStore.id(name);
                    if (id in scopeAttribs) {
                        return scopeAttribs[id];
                    }
                    var binding = attributeState.scope[id];
                    if (!binding) {
                        binding = attributeState.scope[id] = new AttributeRecord();
                    }
                    var result = scopeAttribs[id] = link(binding);
                    return result;
                };
                return env;
            }
            // ===================================================
            // ===================================================
            // PARSING
            // ===================================================
            // ===================================================
            function parseProfile(options) {
                var staticOptions = options.static;
                var dynamicOptions = options.dynamic;
                var profileEnable;
                if (S_PROFILE in staticOptions) {
                    var value = !!staticOptions[S_PROFILE];
                    profileEnable = createStaticDecl(function (env, scope) {
                        return value;
                    });
                    profileEnable.enable = value;
                }
                else if (S_PROFILE in dynamicOptions) {
                    var dyn = dynamicOptions[S_PROFILE];
                    profileEnable = createDynamicDecl(dyn, function (env, scope) {
                        return env.invoke(scope, dyn);
                    });
                }
                return profileEnable;
            }
            function parseFramebuffer(options, env) {
                var staticOptions = options.static;
                var dynamicOptions = options.dynamic;
                if (S_FRAMEBUFFER in staticOptions) {
                    var framebuffer = staticOptions[S_FRAMEBUFFER];
                    if (framebuffer) {
                        framebuffer = framebufferState.getFramebuffer(framebuffer);
                        check$1.command(framebuffer, 'invalid framebuffer object');
                        return createStaticDecl(function (env, block) {
                            var FRAMEBUFFER = env.link(framebuffer);
                            var shared = env.shared;
                            block.set(shared.framebuffer, '.next', FRAMEBUFFER);
                            var CONTEXT = shared.context;
                            block.set(CONTEXT, '.' + S_FRAMEBUFFER_WIDTH, FRAMEBUFFER + '.width');
                            block.set(CONTEXT, '.' + S_FRAMEBUFFER_HEIGHT, FRAMEBUFFER + '.height');
                            return FRAMEBUFFER;
                        });
                    }
                    else {
                        return createStaticDecl(function (env, scope) {
                            var shared = env.shared;
                            scope.set(shared.framebuffer, '.next', 'null');
                            var CONTEXT = shared.context;
                            scope.set(CONTEXT, '.' + S_FRAMEBUFFER_WIDTH, CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
                            scope.set(CONTEXT, '.' + S_FRAMEBUFFER_HEIGHT, CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
                            return 'null';
                        });
                    }
                }
                else if (S_FRAMEBUFFER in dynamicOptions) {
                    var dyn = dynamicOptions[S_FRAMEBUFFER];
                    return createDynamicDecl(dyn, function (env, scope) {
                        var FRAMEBUFFER_FUNC = env.invoke(scope, dyn);
                        var shared = env.shared;
                        var FRAMEBUFFER_STATE = shared.framebuffer;
                        var FRAMEBUFFER = scope.def(FRAMEBUFFER_STATE, '.getFramebuffer(', FRAMEBUFFER_FUNC, ')');
                        check$1.optional(function () {
                            env.assert(scope, '!' + FRAMEBUFFER_FUNC + '||' + FRAMEBUFFER, 'invalid framebuffer object');
                        });
                        scope.set(FRAMEBUFFER_STATE, '.next', FRAMEBUFFER);
                        var CONTEXT = shared.context;
                        scope.set(CONTEXT, '.' + S_FRAMEBUFFER_WIDTH, FRAMEBUFFER + '?' + FRAMEBUFFER + '.width:' +
                            CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
                        scope.set(CONTEXT, '.' + S_FRAMEBUFFER_HEIGHT, FRAMEBUFFER +
                            '?' + FRAMEBUFFER + '.height:' +
                            CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
                        return FRAMEBUFFER;
                    });
                }
                else {
                    return null;
                }
            }
            function parseViewportScissor(options, framebuffer, env) {
                var staticOptions = options.static;
                var dynamicOptions = options.dynamic;
                function parseBox(param) {
                    if (param in staticOptions) {
                        var box = staticOptions[param];
                        check$1.commandType(box, 'object', 'invalid ' + param, env.commandStr);
                        var isStatic = true;
                        var x = box.x | 0;
                        var y = box.y | 0;
                        var w, h;
                        if ('width' in box) {
                            w = box.width | 0;
                            check$1.command(w >= 0, 'invalid ' + param, env.commandStr);
                        }
                        else {
                            isStatic = false;
                        }
                        if ('height' in box) {
                            h = box.height | 0;
                            check$1.command(h >= 0, 'invalid ' + param, env.commandStr);
                        }
                        else {
                            isStatic = false;
                        }
                        return new Declaration(!isStatic && framebuffer && framebuffer.thisDep, !isStatic && framebuffer && framebuffer.contextDep, !isStatic && framebuffer && framebuffer.propDep, function (env, scope) {
                            var CONTEXT = env.shared.context;
                            var BOX_W = w;
                            if (!('width' in box)) {
                                BOX_W = scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', x);
                            }
                            var BOX_H = h;
                            if (!('height' in box)) {
                                BOX_H = scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', y);
                            }
                            return [x, y, BOX_W, BOX_H];
                        });
                    }
                    else if (param in dynamicOptions) {
                        var dynBox = dynamicOptions[param];
                        var result = createDynamicDecl(dynBox, function (env, scope) {
                            var BOX = env.invoke(scope, dynBox);
                            check$1.optional(function () {
                                env.assert(scope, BOX + '&&typeof ' + BOX + '==="object"', 'invalid ' + param);
                            });
                            var CONTEXT = env.shared.context;
                            var BOX_X = scope.def(BOX, '.x|0');
                            var BOX_Y = scope.def(BOX, '.y|0');
                            var BOX_W = scope.def('"width" in ', BOX, '?', BOX, '.width|0:', '(', CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', BOX_X, ')');
                            var BOX_H = scope.def('"height" in ', BOX, '?', BOX, '.height|0:', '(', CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', BOX_Y, ')');
                            check$1.optional(function () {
                                env.assert(scope, BOX_W + '>=0&&' +
                                    BOX_H + '>=0', 'invalid ' + param);
                            });
                            return [BOX_X, BOX_Y, BOX_W, BOX_H];
                        });
                        if (framebuffer) {
                            result.thisDep = result.thisDep || framebuffer.thisDep;
                            result.contextDep = result.contextDep || framebuffer.contextDep;
                            result.propDep = result.propDep || framebuffer.propDep;
                        }
                        return result;
                    }
                    else if (framebuffer) {
                        return new Declaration(framebuffer.thisDep, framebuffer.contextDep, framebuffer.propDep, function (env, scope) {
                            var CONTEXT = env.shared.context;
                            return [
                                0, 0,
                                scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH),
                                scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT)
                            ];
                        });
                    }
                    else {
                        return null;
                    }
                }
                var viewport = parseBox(S_VIEWPORT);
                if (viewport) {
                    var prevViewport = viewport;
                    viewport = new Declaration(viewport.thisDep, viewport.contextDep, viewport.propDep, function (env, scope) {
                        var VIEWPORT = prevViewport.append(env, scope);
                        var CONTEXT = env.shared.context;
                        scope.set(CONTEXT, '.' + S_VIEWPORT_WIDTH, VIEWPORT[2]);
                        scope.set(CONTEXT, '.' + S_VIEWPORT_HEIGHT, VIEWPORT[3]);
                        return VIEWPORT;
                    });
                }
                return {
                    viewport: viewport,
                    scissor_box: parseBox(S_SCISSOR_BOX)
                };
            }
            function parseAttribLocations(options, attributes) {
                var staticOptions = options.static;
                var staticProgram = typeof staticOptions[S_FRAG] === 'string' &&
                    typeof staticOptions[S_VERT] === 'string';
                if (staticProgram) {
                    if (Object.keys(attributes.dynamic).length > 0) {
                        return null;
                    }
                    var staticAttributes = attributes.static;
                    var sAttributes = Object.keys(staticAttributes);
                    if (sAttributes.length > 0 && typeof staticAttributes[sAttributes[0]] === 'number') {
                        var bindings = [];
                        for (var i = 0; i < sAttributes.length; ++i) {
                            check$1(typeof staticAttributes[sAttributes[i]] === 'number', 'must specify all vertex attribute locations when using vaos');
                            bindings.push([staticAttributes[sAttributes[i]] | 0, sAttributes[i]]);
                        }
                        return bindings;
                    }
                }
                return null;
            }
            function parseProgram(options, env, attribLocations) {
                var staticOptions = options.static;
                var dynamicOptions = options.dynamic;
                function parseShader(name) {
                    if (name in staticOptions) {
                        var id = stringStore.id(staticOptions[name]);
                        check$1.optional(function () {
                            shaderState.shader(shaderType[name], id, check$1.guessCommand());
                        });
                        var result = createStaticDecl(function () {
                            return id;
                        });
                        result.id = id;
                        return result;
                    }
                    else if (name in dynamicOptions) {
                        var dyn = dynamicOptions[name];
                        return createDynamicDecl(dyn, function (env, scope) {
                            var str = env.invoke(scope, dyn);
                            var id = scope.def(env.shared.strings, '.id(', str, ')');
                            check$1.optional(function () {
                                scope(env.shared.shader, '.shader(', shaderType[name], ',', id, ',', env.command, ');');
                            });
                            return id;
                        });
                    }
                    return null;
                }
                var frag = parseShader(S_FRAG);
                var vert = parseShader(S_VERT);
                var program = null;
                var progVar;
                if (isStatic(frag) && isStatic(vert)) {
                    program = shaderState.program(vert.id, frag.id, null, attribLocations);
                    progVar = createStaticDecl(function (env, scope) {
                        return env.link(program);
                    });
                }
                else {
                    progVar = new Declaration((frag && frag.thisDep) || (vert && vert.thisDep), (frag && frag.contextDep) || (vert && vert.contextDep), (frag && frag.propDep) || (vert && vert.propDep), function (env, scope) {
                        var SHADER_STATE = env.shared.shader;
                        var fragId;
                        if (frag) {
                            fragId = frag.append(env, scope);
                        }
                        else {
                            fragId = scope.def(SHADER_STATE, '.', S_FRAG);
                        }
                        var vertId;
                        if (vert) {
                            vertId = vert.append(env, scope);
                        }
                        else {
                            vertId = scope.def(SHADER_STATE, '.', S_VERT);
                        }
                        var progDef = SHADER_STATE + '.program(' + vertId + ',' + fragId;
                        check$1.optional(function () {
                            progDef += ',' + env.command;
                        });
                        return scope.def(progDef + ')');
                    });
                }
                return {
                    frag: frag,
                    vert: vert,
                    progVar: progVar,
                    program: program
                };
            }
            function parseDraw(options, env) {
                var staticOptions = options.static;
                var dynamicOptions = options.dynamic;
                // TODO: should use VAO to get default values for offset properties
                // should move vao parse into here and out of the old stuff
                var staticDraw = {};
                var vaoActive = false;
                function parseVAO() {
                    if (S_VAO in staticOptions) {
                        var vao = staticOptions[S_VAO];
                        if (vao !== null && attributeState.getVAO(vao) === null) {
                            vao = attributeState.createVAO(vao);
                        }
                        vaoActive = true;
                        staticDraw.vao = vao;
                        return createStaticDecl(function (env) {
                            var vaoRef = attributeState.getVAO(vao);
                            if (vaoRef) {
                                return env.link(vaoRef);
                            }
                            else {
                                return 'null';
                            }
                        });
                    }
                    else if (S_VAO in dynamicOptions) {
                        vaoActive = true;
                        var dyn = dynamicOptions[S_VAO];
                        return createDynamicDecl(dyn, function (env, scope) {
                            var vaoRef = env.invoke(scope, dyn);
                            return scope.def(env.shared.vao + '.getVAO(' + vaoRef + ')');
                        });
                    }
                    return null;
                }
                var vao = parseVAO();
                var elementsActive = false;
                function parseElements() {
                    if (S_ELEMENTS in staticOptions) {
                        var elements = staticOptions[S_ELEMENTS];
                        staticDraw.elements = elements;
                        if (isBufferArgs(elements)) {
                            var e = staticDraw.elements = elementState.create(elements, true);
                            elements = elementState.getElements(e);
                            elementsActive = true;
                        }
                        else if (elements) {
                            elements = elementState.getElements(elements);
                            elementsActive = true;
                            check$1.command(elements, 'invalid elements', env.commandStr);
                        }
                        var result = createStaticDecl(function (env, scope) {
                            if (elements) {
                                var result = env.link(elements);
                                env.ELEMENTS = result;
                                return result;
                            }
                            env.ELEMENTS = null;
                            return null;
                        });
                        result.value = elements;
                        return result;
                    }
                    else if (S_ELEMENTS in dynamicOptions) {
                        elementsActive = true;
                        var dyn = dynamicOptions[S_ELEMENTS];
                        return createDynamicDecl(dyn, function (env, scope) {
                            var shared = env.shared;
                            var IS_BUFFER_ARGS = shared.isBufferArgs;
                            var ELEMENT_STATE = shared.elements;
                            var elementDefn = env.invoke(scope, dyn);
                            var elements = scope.def('null');
                            var elementStream = scope.def(IS_BUFFER_ARGS, '(', elementDefn, ')');
                            var ifte = env.cond(elementStream)
                                .then(elements, '=', ELEMENT_STATE, '.createStream(', elementDefn, ');')
                                .else(elements, '=', ELEMENT_STATE, '.getElements(', elementDefn, ');');
                            check$1.optional(function () {
                                env.assert(ifte.else, '!' + elementDefn + '||' + elements, 'invalid elements');
                            });
                            scope.entry(ifte);
                            scope.exit(env.cond(elementStream)
                                .then(ELEMENT_STATE, '.destroyStream(', elements, ');'));
                            env.ELEMENTS = elements;
                            return elements;
                        });
                    }
                    else if (vaoActive) {
                        return new Declaration(vao.thisDep, vao.contextDep, vao.propDep, function (env, scope) {
                            return scope.def(env.shared.vao + '.currentVAO?' + env.shared.elements + '.getElements(' + env.shared.vao + '.currentVAO.elements):null');
                        });
                    }
                    return null;
                }
                var elements = parseElements();
                function parsePrimitive() {
                    if (S_PRIMITIVE in staticOptions) {
                        var primitive = staticOptions[S_PRIMITIVE];
                        staticDraw.primitive = primitive;
                        check$1.commandParameter(primitive, primTypes, 'invalid primitve', env.commandStr);
                        return createStaticDecl(function (env, scope) {
                            return primTypes[primitive];
                        });
                    }
                    else if (S_PRIMITIVE in dynamicOptions) {
                        var dynPrimitive = dynamicOptions[S_PRIMITIVE];
                        return createDynamicDecl(dynPrimitive, function (env, scope) {
                            var PRIM_TYPES = env.constants.primTypes;
                            var prim = env.invoke(scope, dynPrimitive);
                            check$1.optional(function () {
                                env.assert(scope, prim + ' in ' + PRIM_TYPES, 'invalid primitive, must be one of ' + Object.keys(primTypes));
                            });
                            return scope.def(PRIM_TYPES, '[', prim, ']');
                        });
                    }
                    else if (elementsActive) {
                        if (isStatic(elements)) {
                            if (elements.value) {
                                return createStaticDecl(function (env, scope) {
                                    return scope.def(env.ELEMENTS, '.primType');
                                });
                            }
                            else {
                                return createStaticDecl(function () {
                                    return GL_TRIANGLES$1;
                                });
                            }
                        }
                        else {
                            return new Declaration(elements.thisDep, elements.contextDep, elements.propDep, function (env, scope) {
                                var elements = env.ELEMENTS;
                                return scope.def(elements, '?', elements, '.primType:', GL_TRIANGLES$1);
                            });
                        }
                    }
                    else if (vaoActive) {
                        return new Declaration(vao.thisDep, vao.contextDep, vao.propDep, function (env, scope) {
                            return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.primitive:' + GL_TRIANGLES$1);
                        });
                    }
                    return null;
                }
                function parseParam(param, isOffset) {
                    if (param in staticOptions) {
                        var value = staticOptions[param] | 0;
                        if (isOffset) {
                            staticDraw.offset = value;
                        }
                        else {
                            staticDraw.instances = value;
                        }
                        check$1.command(!isOffset || value >= 0, 'invalid ' + param, env.commandStr);
                        return createStaticDecl(function (env, scope) {
                            if (isOffset) {
                                env.OFFSET = value;
                            }
                            return value;
                        });
                    }
                    else if (param in dynamicOptions) {
                        var dynValue = dynamicOptions[param];
                        return createDynamicDecl(dynValue, function (env, scope) {
                            var result = env.invoke(scope, dynValue);
                            if (isOffset) {
                                env.OFFSET = result;
                                check$1.optional(function () {
                                    env.assert(scope, result + '>=0', 'invalid ' + param);
                                });
                            }
                            return result;
                        });
                    }
                    else if (isOffset) {
                        if (elementsActive) {
                            return createStaticDecl(function (env, scope) {
                                env.OFFSET = 0;
                                return 0;
                            });
                        }
                        else if (vaoActive) {
                            return new Declaration(vao.thisDep, vao.contextDep, vao.propDep, function (env, scope) {
                                return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.offset:0');
                            });
                        }
                    }
                    else if (vaoActive) {
                        return new Declaration(vao.thisDep, vao.contextDep, vao.propDep, function (env, scope) {
                            return scope.def(env.shared.vao + '.currentVAO?' + env.shared.vao + '.currentVAO.instances:-1');
                        });
                    }
                    return null;
                }
                var OFFSET = parseParam(S_OFFSET, true);
                function parseVertCount() {
                    if (S_COUNT in staticOptions) {
                        var count = staticOptions[S_COUNT] | 0;
                        staticDraw.count = count;
                        check$1.command(typeof count === 'number' && count >= 0, 'invalid vertex count', env.commandStr);
                        return createStaticDecl(function () {
                            return count;
                        });
                    }
                    else if (S_COUNT in dynamicOptions) {
                        var dynCount = dynamicOptions[S_COUNT];
                        return createDynamicDecl(dynCount, function (env, scope) {
                            var result = env.invoke(scope, dynCount);
                            check$1.optional(function () {
                                env.assert(scope, 'typeof ' + result + '==="number"&&' +
                                    result + '>=0&&' +
                                    result + '===(' + result + '|0)', 'invalid vertex count');
                            });
                            return result;
                        });
                    }
                    else if (elementsActive) {
                        if (isStatic(elements)) {
                            if (elements) {
                                if (OFFSET) {
                                    return new Declaration(OFFSET.thisDep, OFFSET.contextDep, OFFSET.propDep, function (env, scope) {
                                        var result = scope.def(env.ELEMENTS, '.vertCount-', env.OFFSET);
                                        check$1.optional(function () {
                                            env.assert(scope, result + '>=0', 'invalid vertex offset/element buffer too small');
                                        });
                                        return result;
                                    });
                                }
                                else {
                                    return createStaticDecl(function (env, scope) {
                                        return scope.def(env.ELEMENTS, '.vertCount');
                                    });
                                }
                            }
                            else {
                                var result = createStaticDecl(function () {
                                    return -1;
                                });
                                check$1.optional(function () {
                                    result.MISSING = true;
                                });
                                return result;
                            }
                        }
                        else {
                            var variable = new Declaration(elements.thisDep || OFFSET.thisDep, elements.contextDep || OFFSET.contextDep, elements.propDep || OFFSET.propDep, function (env, scope) {
                                var elements = env.ELEMENTS;
                                if (env.OFFSET) {
                                    return scope.def(elements, '?', elements, '.vertCount-', env.OFFSET, ':-1');
                                }
                                return scope.def(elements, '?', elements, '.vertCount:-1');
                            });
                            check$1.optional(function () {
                                variable.DYNAMIC = true;
                            });
                            return variable;
                        }
                    }
                    else if (vaoActive) {
                        var countVariable = new Declaration(vao.thisDep, vao.contextDep, vao.propDep, function (env, scope) {
                            return scope.def(env.shared.vao, '.currentVAO?', env.shared.vao, '.currentVAO.count:-1');
                        });
                        return countVariable;
                    }
                    return null;
                }
                var primitive = parsePrimitive();
                var count = parseVertCount();
                var instances = parseParam(S_INSTANCES, false);
                return {
                    elements: elements,
                    primitive: primitive,
                    count: count,
                    instances: instances,
                    offset: OFFSET,
                    vao: vao,
                    vaoActive: vaoActive,
                    elementsActive: elementsActive,
                    // static draw props
                    static: staticDraw
                };
            }
            function parseGLState(options, env) {
                var staticOptions = options.static;
                var dynamicOptions = options.dynamic;
                var STATE = {};
                GL_STATE_NAMES.forEach(function (prop) {
                    var param = propName(prop);
                    function parseParam(parseStatic, parseDynamic) {
                        if (prop in staticOptions) {
                            var value = parseStatic(staticOptions[prop]);
                            STATE[param] = createStaticDecl(function () {
                                return value;
                            });
                        }
                        else if (prop in dynamicOptions) {
                            var dyn = dynamicOptions[prop];
                            STATE[param] = createDynamicDecl(dyn, function (env, scope) {
                                return parseDynamic(env, scope, env.invoke(scope, dyn));
                            });
                        }
                    }
                    switch (prop) {
                        case S_CULL_ENABLE:
                        case S_BLEND_ENABLE:
                        case S_DITHER:
                        case S_STENCIL_ENABLE:
                        case S_DEPTH_ENABLE:
                        case S_SCISSOR_ENABLE:
                        case S_POLYGON_OFFSET_ENABLE:
                        case S_SAMPLE_ALPHA:
                        case S_SAMPLE_ENABLE:
                        case S_DEPTH_MASK:
                            return parseParam(function (value) {
                                check$1.commandType(value, 'boolean', prop, env.commandStr);
                                return value;
                            }, function (env, scope, value) {
                                check$1.optional(function () {
                                    env.assert(scope, 'typeof ' + value + '==="boolean"', 'invalid flag ' + prop, env.commandStr);
                                });
                                return value;
                            });
                        case S_DEPTH_FUNC:
                            return parseParam(function (value) {
                                check$1.commandParameter(value, compareFuncs, 'invalid ' + prop, env.commandStr);
                                return compareFuncs[value];
                            }, function (env, scope, value) {
                                var COMPARE_FUNCS = env.constants.compareFuncs;
                                check$1.optional(function () {
                                    env.assert(scope, value + ' in ' + COMPARE_FUNCS, 'invalid ' + prop + ', must be one of ' + Object.keys(compareFuncs));
                                });
                                return scope.def(COMPARE_FUNCS, '[', value, ']');
                            });
                        case S_DEPTH_RANGE:
                            return parseParam(function (value) {
                                check$1.command(isArrayLike(value) &&
                                    value.length === 2 &&
                                    typeof value[0] === 'number' &&
                                    typeof value[1] === 'number' &&
                                    value[0] <= value[1], 'depth range is 2d array', env.commandStr);
                                return value;
                            }, function (env, scope, value) {
                                check$1.optional(function () {
                                    env.assert(scope, env.shared.isArrayLike + '(' + value + ')&&' +
                                        value + '.length===2&&' +
                                        'typeof ' + value + '[0]==="number"&&' +
                                        'typeof ' + value + '[1]==="number"&&' +
                                        value + '[0]<=' + value + '[1]', 'depth range must be a 2d array');
                                });
                                var Z_NEAR = scope.def('+', value, '[0]');
                                var Z_FAR = scope.def('+', value, '[1]');
                                return [Z_NEAR, Z_FAR];
                            });
                        case S_BLEND_FUNC:
                            return parseParam(function (value) {
                                check$1.commandType(value, 'object', 'blend.func', env.commandStr);
                                var srcRGB = ('srcRGB' in value ? value.srcRGB : value.src);
                                var srcAlpha = ('srcAlpha' in value ? value.srcAlpha : value.src);
                                var dstRGB = ('dstRGB' in value ? value.dstRGB : value.dst);
                                var dstAlpha = ('dstAlpha' in value ? value.dstAlpha : value.dst);
                                check$1.commandParameter(srcRGB, blendFuncs, param + '.srcRGB', env.commandStr);
                                check$1.commandParameter(srcAlpha, blendFuncs, param + '.srcAlpha', env.commandStr);
                                check$1.commandParameter(dstRGB, blendFuncs, param + '.dstRGB', env.commandStr);
                                check$1.commandParameter(dstAlpha, blendFuncs, param + '.dstAlpha', env.commandStr);
                                check$1.command((invalidBlendCombinations.indexOf(srcRGB + ', ' + dstRGB) === -1), 'unallowed blending combination (srcRGB, dstRGB) = (' + srcRGB + ', ' + dstRGB + ')', env.commandStr);
                                return [
                                    blendFuncs[srcRGB],
                                    blendFuncs[dstRGB],
                                    blendFuncs[srcAlpha],
                                    blendFuncs[dstAlpha]
                                ];
                            }, function (env, scope, value) {
                                var BLEND_FUNCS = env.constants.blendFuncs;
                                check$1.optional(function () {
                                    env.assert(scope, value + '&&typeof ' + value + '==="object"', 'invalid blend func, must be an object');
                                });
                                function read(prefix, suffix) {
                                    var func = scope.def('"', prefix, suffix, '" in ', value, '?', value, '.', prefix, suffix, ':', value, '.', prefix);
                                    check$1.optional(function () {
                                        env.assert(scope, func + ' in ' + BLEND_FUNCS, 'invalid ' + prop + '.' + prefix + suffix + ', must be one of ' + Object.keys(blendFuncs));
                                    });
                                    return func;
                                }
                                var srcRGB = read('src', 'RGB');
                                var dstRGB = read('dst', 'RGB');
                                check$1.optional(function () {
                                    var INVALID_BLEND_COMBINATIONS = env.constants.invalidBlendCombinations;
                                    env.assert(scope, INVALID_BLEND_COMBINATIONS +
                                        '.indexOf(' + srcRGB + '+", "+' + dstRGB + ') === -1 ', 'unallowed blending combination for (srcRGB, dstRGB)');
                                });
                                var SRC_RGB = scope.def(BLEND_FUNCS, '[', srcRGB, ']');
                                var SRC_ALPHA = scope.def(BLEND_FUNCS, '[', read('src', 'Alpha'), ']');
                                var DST_RGB = scope.def(BLEND_FUNCS, '[', dstRGB, ']');
                                var DST_ALPHA = scope.def(BLEND_FUNCS, '[', read('dst', 'Alpha'), ']');
                                return [SRC_RGB, DST_RGB, SRC_ALPHA, DST_ALPHA];
                            });
                        case S_BLEND_EQUATION:
                            return parseParam(function (value) {
                                if (typeof value === 'string') {
                                    check$1.commandParameter(value, blendEquations, 'invalid ' + prop, env.commandStr);
                                    return [
                                        blendEquations[value],
                                        blendEquations[value]
                                    ];
                                }
                                else if (typeof value === 'object') {
                                    check$1.commandParameter(value.rgb, blendEquations, prop + '.rgb', env.commandStr);
                                    check$1.commandParameter(value.alpha, blendEquations, prop + '.alpha', env.commandStr);
                                    return [
                                        blendEquations[value.rgb],
                                        blendEquations[value.alpha]
                                    ];
                                }
                                else {
                                    check$1.commandRaise('invalid blend.equation', env.commandStr);
                                }
                            }, function (env, scope, value) {
                                var BLEND_EQUATIONS = env.constants.blendEquations;
                                var RGB = scope.def();
                                var ALPHA = scope.def();
                                var ifte = env.cond('typeof ', value, '==="string"');
                                check$1.optional(function () {
                                    function checkProp(block, name, value) {
                                        env.assert(block, value + ' in ' + BLEND_EQUATIONS, 'invalid ' + name + ', must be one of ' + Object.keys(blendEquations));
                                    }
                                    checkProp(ifte.then, prop, value);
                                    env.assert(ifte.else, value + '&&typeof ' + value + '==="object"', 'invalid ' + prop);
                                    checkProp(ifte.else, prop + '.rgb', value + '.rgb');
                                    checkProp(ifte.else, prop + '.alpha', value + '.alpha');
                                });
                                ifte.then(RGB, '=', ALPHA, '=', BLEND_EQUATIONS, '[', value, '];');
                                ifte.else(RGB, '=', BLEND_EQUATIONS, '[', value, '.rgb];', ALPHA, '=', BLEND_EQUATIONS, '[', value, '.alpha];');
                                scope(ifte);
                                return [RGB, ALPHA];
                            });
                        case S_BLEND_COLOR:
                            return parseParam(function (value) {
                                check$1.command(isArrayLike(value) &&
                                    value.length === 4, 'blend.color must be a 4d array', env.commandStr);
                                return loop(4, function (i) {
                                    return +value[i];
                                });
                            }, function (env, scope, value) {
                                check$1.optional(function () {
                                    env.assert(scope, env.shared.isArrayLike + '(' + value + ')&&' +
                                        value + '.length===4', 'blend.color must be a 4d array');
                                });
                                return loop(4, function (i) {
                                    return scope.def('+', value, '[', i, ']');
                                });
                            });
                        case S_STENCIL_MASK:
                            return parseParam(function (value) {
                                check$1.commandType(value, 'number', param, env.commandStr);
                                return value | 0;
                            }, function (env, scope, value) {
                                check$1.optional(function () {
                                    env.assert(scope, 'typeof ' + value + '==="number"', 'invalid stencil.mask');
                                });
                                return scope.def(value, '|0');
                            });
                        case S_STENCIL_FUNC:
                            return parseParam(function (value) {
                                check$1.commandType(value, 'object', param, env.commandStr);
                                var cmp = value.cmp || 'keep';
                                var ref = value.ref || 0;
                                var mask = 'mask' in value ? value.mask : -1;
                                check$1.commandParameter(cmp, compareFuncs, prop + '.cmp', env.commandStr);
                                check$1.commandType(ref, 'number', prop + '.ref', env.commandStr);
                                check$1.commandType(mask, 'number', prop + '.mask', env.commandStr);
                                return [
                                    compareFuncs[cmp],
                                    ref,
                                    mask
                                ];
                            }, function (env, scope, value) {
                                var COMPARE_FUNCS = env.constants.compareFuncs;
                                check$1.optional(function () {
                                    function assert() {
                                        env.assert(scope, Array.prototype.join.call(arguments, ''), 'invalid stencil.func');
                                    }
                                    assert(value + '&&typeof ', value, '==="object"');
                                    assert('!("cmp" in ', value, ')||(', value, '.cmp in ', COMPARE_FUNCS, ')');
                                });
                                var cmp = scope.def('"cmp" in ', value, '?', COMPARE_FUNCS, '[', value, '.cmp]', ':', GL_KEEP);
                                var ref = scope.def(value, '.ref|0');
                                var mask = scope.def('"mask" in ', value, '?', value, '.mask|0:-1');
                                return [cmp, ref, mask];
                            });
                        case S_STENCIL_OPFRONT:
                        case S_STENCIL_OPBACK:
                            return parseParam(function (value) {
                                check$1.commandType(value, 'object', param, env.commandStr);
                                var fail = value.fail || 'keep';
                                var zfail = value.zfail || 'keep';
                                var zpass = value.zpass || 'keep';
                                check$1.commandParameter(fail, stencilOps, prop + '.fail', env.commandStr);
                                check$1.commandParameter(zfail, stencilOps, prop + '.zfail', env.commandStr);
                                check$1.commandParameter(zpass, stencilOps, prop + '.zpass', env.commandStr);
                                return [
                                    prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                                    stencilOps[fail],
                                    stencilOps[zfail],
                                    stencilOps[zpass]
                                ];
                            }, function (env, scope, value) {
                                var STENCIL_OPS = env.constants.stencilOps;
                                check$1.optional(function () {
                                    env.assert(scope, value + '&&typeof ' + value + '==="object"', 'invalid ' + prop);
                                });
                                function read(name) {
                                    check$1.optional(function () {
                                        env.assert(scope, '!("' + name + '" in ' + value + ')||' +
                                            '(' + value + '.' + name + ' in ' + STENCIL_OPS + ')', 'invalid ' + prop + '.' + name + ', must be one of ' + Object.keys(stencilOps));
                                    });
                                    return scope.def('"', name, '" in ', value, '?', STENCIL_OPS, '[', value, '.', name, ']:', GL_KEEP);
                                }
                                return [
                                    prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                                    read('fail'),
                                    read('zfail'),
                                    read('zpass')
                                ];
                            });
                        case S_POLYGON_OFFSET_OFFSET:
                            return parseParam(function (value) {
                                check$1.commandType(value, 'object', param, env.commandStr);
                                var factor = value.factor | 0;
                                var units = value.units | 0;
                                check$1.commandType(factor, 'number', param + '.factor', env.commandStr);
                                check$1.commandType(units, 'number', param + '.units', env.commandStr);
                                return [factor, units];
                            }, function (env, scope, value) {
                                check$1.optional(function () {
                                    env.assert(scope, value + '&&typeof ' + value + '==="object"', 'invalid ' + prop);
                                });
                                var FACTOR = scope.def(value, '.factor|0');
                                var UNITS = scope.def(value, '.units|0');
                                return [FACTOR, UNITS];
                            });
                        case S_CULL_FACE:
                            return parseParam(function (value) {
                                var face = 0;
                                if (value === 'front') {
                                    face = GL_FRONT;
                                }
                                else if (value === 'back') {
                                    face = GL_BACK;
                                }
                                check$1.command(!!face, param, env.commandStr);
                                return face;
                            }, function (env, scope, value) {
                                check$1.optional(function () {
                                    env.assert(scope, value + '==="front"||' +
                                        value + '==="back"', 'invalid cull.face');
                                });
                                return scope.def(value, '==="front"?', GL_FRONT, ':', GL_BACK);
                            });
                        case S_LINE_WIDTH:
                            return parseParam(function (value) {
                                check$1.command(typeof value === 'number' &&
                                    value >= limits.lineWidthDims[0] &&
                                    value <= limits.lineWidthDims[1], 'invalid line width, must be a positive number between ' +
                                    limits.lineWidthDims[0] + ' and ' + limits.lineWidthDims[1], env.commandStr);
                                return value;
                            }, function (env, scope, value) {
                                check$1.optional(function () {
                                    env.assert(scope, 'typeof ' + value + '==="number"&&' +
                                        value + '>=' + limits.lineWidthDims[0] + '&&' +
                                        value + '<=' + limits.lineWidthDims[1], 'invalid line width');
                                });
                                return value;
                            });
                        case S_FRONT_FACE:
                            return parseParam(function (value) {
                                check$1.commandParameter(value, orientationType, param, env.commandStr);
                                return orientationType[value];
                            }, function (env, scope, value) {
                                check$1.optional(function () {
                                    env.assert(scope, value + '==="cw"||' +
                                        value + '==="ccw"', 'invalid frontFace, must be one of cw,ccw');
                                });
                                return scope.def(value + '==="cw"?' + GL_CW + ':' + GL_CCW);
                            });
                        case S_COLOR_MASK:
                            return parseParam(function (value) {
                                check$1.command(isArrayLike(value) && value.length === 4, 'color.mask must be length 4 array', env.commandStr);
                                return value.map(function (v) { return !!v; });
                            }, function (env, scope, value) {
                                check$1.optional(function () {
                                    env.assert(scope, env.shared.isArrayLike + '(' + value + ')&&' +
                                        value + '.length===4', 'invalid color.mask');
                                });
                                return loop(4, function (i) {
                                    return '!!' + value + '[' + i + ']';
                                });
                            });
                        case S_SAMPLE_COVERAGE:
                            return parseParam(function (value) {
                                check$1.command(typeof value === 'object' && value, param, env.commandStr);
                                var sampleValue = 'value' in value ? value.value : 1;
                                var sampleInvert = !!value.invert;
                                check$1.command(typeof sampleValue === 'number' &&
                                    sampleValue >= 0 && sampleValue <= 1, 'sample.coverage.value must be a number between 0 and 1', env.commandStr);
                                return [sampleValue, sampleInvert];
                            }, function (env, scope, value) {
                                check$1.optional(function () {
                                    env.assert(scope, value + '&&typeof ' + value + '==="object"', 'invalid sample.coverage');
                                });
                                var VALUE = scope.def('"value" in ', value, '?+', value, '.value:1');
                                var INVERT = scope.def('!!', value, '.invert');
                                return [VALUE, INVERT];
                            });
                    }
                });
                return STATE;
            }
            function parseUniforms(uniforms, env) {
                var staticUniforms = uniforms.static;
                var dynamicUniforms = uniforms.dynamic;
                var UNIFORMS = {};
                Object.keys(staticUniforms).forEach(function (name) {
                    var value = staticUniforms[name];
                    var result;
                    if (typeof value === 'number' ||
                        typeof value === 'boolean') {
                        result = createStaticDecl(function () {
                            return value;
                        });
                    }
                    else if (typeof value === 'function') {
                        var reglType = value._reglType;
                        if (reglType === 'texture2d' ||
                            reglType === 'textureCube') {
                            result = createStaticDecl(function (env) {
                                return env.link(value);
                            });
                        }
                        else if (reglType === 'framebuffer' ||
                            reglType === 'framebufferCube') {
                            check$1.command(value.color.length > 0, 'missing color attachment for framebuffer sent to uniform "' + name + '"', env.commandStr);
                            result = createStaticDecl(function (env) {
                                return env.link(value.color[0]);
                            });
                        }
                        else {
                            check$1.commandRaise('invalid data for uniform "' + name + '"', env.commandStr);
                        }
                    }
                    else if (isArrayLike(value)) {
                        result = createStaticDecl(function (env) {
                            var ITEM = env.global.def('[', loop(value.length, function (i) {
                                check$1.command(typeof value[i] === 'number' ||
                                    typeof value[i] === 'boolean', 'invalid uniform ' + name, env.commandStr);
                                return value[i];
                            }), ']');
                            return ITEM;
                        });
                    }
                    else {
                        check$1.commandRaise('invalid or missing data for uniform "' + name + '"', env.commandStr);
                    }
                    result.value = value;
                    UNIFORMS[name] = result;
                });
                Object.keys(dynamicUniforms).forEach(function (key) {
                    var dyn = dynamicUniforms[key];
                    UNIFORMS[key] = createDynamicDecl(dyn, function (env, scope) {
                        return env.invoke(scope, dyn);
                    });
                });
                return UNIFORMS;
            }
            function parseAttributes(attributes, env) {
                var staticAttributes = attributes.static;
                var dynamicAttributes = attributes.dynamic;
                var attributeDefs = {};
                Object.keys(staticAttributes).forEach(function (attribute) {
                    var value = staticAttributes[attribute];
                    var id = stringStore.id(attribute);
                    var record = new AttributeRecord();
                    if (isBufferArgs(value)) {
                        record.state = ATTRIB_STATE_POINTER;
                        record.buffer = bufferState.getBuffer(bufferState.create(value, GL_ARRAY_BUFFER$2, false, true));
                        record.type = 0;
                    }
                    else {
                        var buffer = bufferState.getBuffer(value);
                        if (buffer) {
                            record.state = ATTRIB_STATE_POINTER;
                            record.buffer = buffer;
                            record.type = 0;
                        }
                        else {
                            check$1.command(typeof value === 'object' && value, 'invalid data for attribute ' + attribute, env.commandStr);
                            if ('constant' in value) {
                                var constant = value.constant;
                                record.buffer = 'null';
                                record.state = ATTRIB_STATE_CONSTANT;
                                if (typeof constant === 'number') {
                                    record.x = constant;
                                }
                                else {
                                    check$1.command(isArrayLike(constant) &&
                                        constant.length > 0 &&
                                        constant.length <= 4, 'invalid constant for attribute ' + attribute, env.commandStr);
                                    CUTE_COMPONENTS.forEach(function (c, i) {
                                        if (i < constant.length) {
                                            record[c] = constant[i];
                                        }
                                    });
                                }
                            }
                            else {
                                if (isBufferArgs(value.buffer)) {
                                    buffer = bufferState.getBuffer(bufferState.create(value.buffer, GL_ARRAY_BUFFER$2, false, true));
                                }
                                else {
                                    buffer = bufferState.getBuffer(value.buffer);
                                }
                                check$1.command(!!buffer, 'missing buffer for attribute "' + attribute + '"', env.commandStr);
                                var offset = value.offset | 0;
                                check$1.command(offset >= 0, 'invalid offset for attribute "' + attribute + '"', env.commandStr);
                                var stride = value.stride | 0;
                                check$1.command(stride >= 0 && stride < 256, 'invalid stride for attribute "' + attribute + '", must be integer betweeen [0, 255]', env.commandStr);
                                var size = value.size | 0;
                                check$1.command(!('size' in value) || (size > 0 && size <= 4), 'invalid size for attribute "' + attribute + '", must be 1,2,3,4', env.commandStr);
                                var normalized = !!value.normalized;
                                var type = 0;
                                if ('type' in value) {
                                    check$1.commandParameter(value.type, glTypes, 'invalid type for attribute ' + attribute, env.commandStr);
                                    type = glTypes[value.type];
                                }
                                var divisor = value.divisor | 0;
                                check$1.optional(function () {
                                    if ('divisor' in value) {
                                        check$1.command(divisor === 0 || extInstancing, 'cannot specify divisor for attribute "' + attribute + '", instancing not supported', env.commandStr);
                                        check$1.command(divisor >= 0, 'invalid divisor for attribute "' + attribute + '"', env.commandStr);
                                    }
                                    var command = env.commandStr;
                                    var VALID_KEYS = [
                                        'buffer',
                                        'offset',
                                        'divisor',
                                        'normalized',
                                        'type',
                                        'size',
                                        'stride'
                                    ];
                                    Object.keys(value).forEach(function (prop) {
                                        check$1.command(VALID_KEYS.indexOf(prop) >= 0, 'unknown parameter "' + prop + '" for attribute pointer "' + attribute + '" (valid parameters are ' + VALID_KEYS + ')', command);
                                    });
                                });
                                record.buffer = buffer;
                                record.state = ATTRIB_STATE_POINTER;
                                record.size = size;
                                record.normalized = normalized;
                                record.type = type || buffer.dtype;
                                record.offset = offset;
                                record.stride = stride;
                                record.divisor = divisor;
                            }
                        }
                    }
                    attributeDefs[attribute] = createStaticDecl(function (env, scope) {
                        var cache = env.attribCache;
                        if (id in cache) {
                            return cache[id];
                        }
                        var result = {
                            isStream: false
                        };
                        Object.keys(record).forEach(function (key) {
                            result[key] = record[key];
                        });
                        if (record.buffer) {
                            result.buffer = env.link(record.buffer);
                            result.type = result.type || (result.buffer + '.dtype');
                        }
                        cache[id] = result;
                        return result;
                    });
                });
                Object.keys(dynamicAttributes).forEach(function (attribute) {
                    var dyn = dynamicAttributes[attribute];
                    function appendAttributeCode(env, block) {
                        var VALUE = env.invoke(block, dyn);
                        var shared = env.shared;
                        var constants = env.constants;
                        var IS_BUFFER_ARGS = shared.isBufferArgs;
                        var BUFFER_STATE = shared.buffer;
                        // Perform validation on attribute
                        check$1.optional(function () {
                            env.assert(block, VALUE + '&&(typeof ' + VALUE + '==="object"||typeof ' +
                                VALUE + '==="function")&&(' +
                                IS_BUFFER_ARGS + '(' + VALUE + ')||' +
                                BUFFER_STATE + '.getBuffer(' + VALUE + ')||' +
                                BUFFER_STATE + '.getBuffer(' + VALUE + '.buffer)||' +
                                IS_BUFFER_ARGS + '(' + VALUE + '.buffer)||' +
                                '("constant" in ' + VALUE +
                                '&&(typeof ' + VALUE + '.constant==="number"||' +
                                shared.isArrayLike + '(' + VALUE + '.constant))))', 'invalid dynamic attribute "' + attribute + '"');
                        });
                        // allocate names for result
                        var result = {
                            isStream: block.def(false)
                        };
                        var defaultRecord = new AttributeRecord();
                        defaultRecord.state = ATTRIB_STATE_POINTER;
                        Object.keys(defaultRecord).forEach(function (key) {
                            result[key] = block.def('' + defaultRecord[key]);
                        });
                        var BUFFER = result.buffer;
                        var TYPE = result.type;
                        block('if(', IS_BUFFER_ARGS, '(', VALUE, ')){', result.isStream, '=true;', BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$2, ',', VALUE, ');', TYPE, '=', BUFFER, '.dtype;', '}else{', BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, ');', 'if(', BUFFER, '){', TYPE, '=', BUFFER, '.dtype;', '}else if("constant" in ', VALUE, '){', result.state, '=', ATTRIB_STATE_CONSTANT, ';', 'if(typeof ' + VALUE + '.constant === "number"){', result[CUTE_COMPONENTS[0]], '=', VALUE, '.constant;', CUTE_COMPONENTS.slice(1).map(function (n) {
                            return result[n];
                        }).join('='), '=0;', '}else{', CUTE_COMPONENTS.map(function (name, i) {
                            return (result[name] + '=' + VALUE + '.constant.length>' + i +
                                '?' + VALUE + '.constant[' + i + ']:0;');
                        }).join(''), '}}else{', 'if(', IS_BUFFER_ARGS, '(', VALUE, '.buffer)){', BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$2, ',', VALUE, '.buffer);', '}else{', BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, '.buffer);', '}', TYPE, '="type" in ', VALUE, '?', constants.glTypes, '[', VALUE, '.type]:', BUFFER, '.dtype;', result.normalized, '=!!', VALUE, '.normalized;');
                        function emitReadRecord(name) {
                            block(result[name], '=', VALUE, '.', name, '|0;');
                        }
                        emitReadRecord('size');
                        emitReadRecord('offset');
                        emitReadRecord('stride');
                        emitReadRecord('divisor');
                        block('}}');
                        block.exit('if(', result.isStream, '){', BUFFER_STATE, '.destroyStream(', BUFFER, ');', '}');
                        return result;
                    }
                    attributeDefs[attribute] = createDynamicDecl(dyn, appendAttributeCode);
                });
                return attributeDefs;
            }
            function parseContext(context) {
                var staticContext = context.static;
                var dynamicContext = context.dynamic;
                var result = {};
                Object.keys(staticContext).forEach(function (name) {
                    var value = staticContext[name];
                    result[name] = createStaticDecl(function (env, scope) {
                        if (typeof value === 'number' || typeof value === 'boolean') {
                            return '' + value;
                        }
                        else {
                            return env.link(value);
                        }
                    });
                });
                Object.keys(dynamicContext).forEach(function (name) {
                    var dyn = dynamicContext[name];
                    result[name] = createDynamicDecl(dyn, function (env, scope) {
                        return env.invoke(scope, dyn);
                    });
                });
                return result;
            }
            function parseArguments(options, attributes, uniforms, context, env) {
                var staticOptions = options.static;
                var dynamicOptions = options.dynamic;
                check$1.optional(function () {
                    var KEY_NAMES = [
                        S_FRAMEBUFFER,
                        S_VERT,
                        S_FRAG,
                        S_ELEMENTS,
                        S_PRIMITIVE,
                        S_OFFSET,
                        S_COUNT,
                        S_INSTANCES,
                        S_PROFILE,
                        S_VAO
                    ].concat(GL_STATE_NAMES);
                    function checkKeys(dict) {
                        Object.keys(dict).forEach(function (key) {
                            check$1.command(KEY_NAMES.indexOf(key) >= 0, 'unknown parameter "' + key + '"', env.commandStr);
                        });
                    }
                    checkKeys(staticOptions);
                    checkKeys(dynamicOptions);
                });
                var attribLocations = parseAttribLocations(options, attributes);
                var framebuffer = parseFramebuffer(options, env);
                var viewportAndScissor = parseViewportScissor(options, framebuffer, env);
                var draw = parseDraw(options, env);
                var state = parseGLState(options, env);
                var shader = parseProgram(options, env, attribLocations);
                function copyBox(name) {
                    var defn = viewportAndScissor[name];
                    if (defn) {
                        state[name] = defn;
                    }
                }
                copyBox(S_VIEWPORT);
                copyBox(propName(S_SCISSOR_BOX));
                var dirty = Object.keys(state).length > 0;
                var result = {
                    framebuffer: framebuffer,
                    draw: draw,
                    shader: shader,
                    state: state,
                    dirty: dirty,
                    scopeVAO: null,
                    drawVAO: null,
                    useVAO: false,
                    attributes: {}
                };
                result.profile = parseProfile(options, env);
                result.uniforms = parseUniforms(uniforms, env);
                result.drawVAO = result.scopeVAO = draw.vao;
                // special case: check if we can statically allocate a vertex array object for this program
                if (!result.drawVAO &&
                    shader.program &&
                    !attribLocations &&
                    extensions.angle_instanced_arrays &&
                    draw.static.elements) {
                    var useVAO = true;
                    var staticBindings = shader.program.attributes.map(function (attr) {
                        var binding = attributes.static[attr];
                        useVAO = useVAO && !!binding;
                        return binding;
                    });
                    if (useVAO && staticBindings.length > 0) {
                        var vao = attributeState.getVAO(attributeState.createVAO({
                            attributes: staticBindings,
                            elements: draw.static.elements
                        }));
                        result.drawVAO = new Declaration(null, null, null, function (env, scope) {
                            return env.link(vao);
                        });
                        result.useVAO = true;
                    }
                }
                if (attribLocations) {
                    result.useVAO = true;
                }
                else {
                    result.attributes = parseAttributes(attributes, env);
                }
                result.context = parseContext(context, env);
                return result;
            }
            // ===================================================
            // ===================================================
            // COMMON UPDATE FUNCTIONS
            // ===================================================
            // ===================================================
            function emitContext(env, scope, context) {
                var shared = env.shared;
                var CONTEXT = shared.context;
                var contextEnter = env.scope();
                Object.keys(context).forEach(function (name) {
                    scope.save(CONTEXT, '.' + name);
                    var defn = context[name];
                    var value = defn.append(env, scope);
                    if (Array.isArray(value)) {
                        contextEnter(CONTEXT, '.', name, '=[', value.join(), '];');
                    }
                    else {
                        contextEnter(CONTEXT, '.', name, '=', value, ';');
                    }
                });
                scope(contextEnter);
            }
            // ===================================================
            // ===================================================
            // COMMON DRAWING FUNCTIONS
            // ===================================================
            // ===================================================
            function emitPollFramebuffer(env, scope, framebuffer, skipCheck) {
                var shared = env.shared;
                var GL = shared.gl;
                var FRAMEBUFFER_STATE = shared.framebuffer;
                var EXT_DRAW_BUFFERS;
                if (extDrawBuffers) {
                    EXT_DRAW_BUFFERS = scope.def(shared.extensions, '.webgl_draw_buffers');
                }
                var constants = env.constants;
                var DRAW_BUFFERS = constants.drawBuffer;
                var BACK_BUFFER = constants.backBuffer;
                var NEXT;
                if (framebuffer) {
                    NEXT = framebuffer.append(env, scope);
                }
                else {
                    NEXT = scope.def(FRAMEBUFFER_STATE, '.next');
                }
                if (!skipCheck) {
                    scope('if(', NEXT, '!==', FRAMEBUFFER_STATE, '.cur){');
                }
                scope('if(', NEXT, '){', GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',', NEXT, '.framebuffer);');
                if (extDrawBuffers) {
                    scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(', DRAW_BUFFERS, '[', NEXT, '.colorAttachments.length]);');
                }
                scope('}else{', GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',null);');
                if (extDrawBuffers) {
                    scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(', BACK_BUFFER, ');');
                }
                scope('}', FRAMEBUFFER_STATE, '.cur=', NEXT, ';');
                if (!skipCheck) {
                    scope('}');
                }
            }
            function emitPollState(env, scope, args) {
                var shared = env.shared;
                var GL = shared.gl;
                var CURRENT_VARS = env.current;
                var NEXT_VARS = env.next;
                var CURRENT_STATE = shared.current;
                var NEXT_STATE = shared.next;
                var block = env.cond(CURRENT_STATE, '.dirty');
                GL_STATE_NAMES.forEach(function (prop) {
                    var param = propName(prop);
                    if (param in args.state) {
                        return;
                    }
                    var NEXT, CURRENT;
                    if (param in NEXT_VARS) {
                        NEXT = NEXT_VARS[param];
                        CURRENT = CURRENT_VARS[param];
                        var parts = loop(currentState[param].length, function (i) {
                            return block.def(NEXT, '[', i, ']');
                        });
                        block(env.cond(parts.map(function (p, i) {
                            return p + '!==' + CURRENT + '[' + i + ']';
                        }).join('||'))
                            .then(GL, '.', GL_VARIABLES[param], '(', parts, ');', parts.map(function (p, i) {
                            return CURRENT + '[' + i + ']=' + p;
                        }).join(';'), ';'));
                    }
                    else {
                        NEXT = block.def(NEXT_STATE, '.', param);
                        var ifte = env.cond(NEXT, '!==', CURRENT_STATE, '.', param);
                        block(ifte);
                        if (param in GL_FLAGS) {
                            ifte(env.cond(NEXT)
                                .then(GL, '.enable(', GL_FLAGS[param], ');')
                                .else(GL, '.disable(', GL_FLAGS[param], ');'), CURRENT_STATE, '.', param, '=', NEXT, ';');
                        }
                        else {
                            ifte(GL, '.', GL_VARIABLES[param], '(', NEXT, ');', CURRENT_STATE, '.', param, '=', NEXT, ';');
                        }
                    }
                });
                if (Object.keys(args.state).length === 0) {
                    block(CURRENT_STATE, '.dirty=false;');
                }
                scope(block);
            }
            function emitSetOptions(env, scope, options, filter) {
                var shared = env.shared;
                var CURRENT_VARS = env.current;
                var CURRENT_STATE = shared.current;
                var GL = shared.gl;
                sortState(Object.keys(options)).forEach(function (param) {
                    var defn = options[param];
                    if (filter && !filter(defn)) {
                        return;
                    }
                    var variable = defn.append(env, scope);
                    if (GL_FLAGS[param]) {
                        var flag = GL_FLAGS[param];
                        if (isStatic(defn)) {
                            if (variable) {
                                scope(GL, '.enable(', flag, ');');
                            }
                            else {
                                scope(GL, '.disable(', flag, ');');
                            }
                        }
                        else {
                            scope(env.cond(variable)
                                .then(GL, '.enable(', flag, ');')
                                .else(GL, '.disable(', flag, ');'));
                        }
                        scope(CURRENT_STATE, '.', param, '=', variable, ';');
                    }
                    else if (isArrayLike(variable)) {
                        var CURRENT = CURRENT_VARS[param];
                        scope(GL, '.', GL_VARIABLES[param], '(', variable, ');', variable.map(function (v, i) {
                            return CURRENT + '[' + i + ']=' + v;
                        }).join(';'), ';');
                    }
                    else {
                        scope(GL, '.', GL_VARIABLES[param], '(', variable, ');', CURRENT_STATE, '.', param, '=', variable, ';');
                    }
                });
            }
            function injectExtensions(env, scope) {
                if (extInstancing) {
                    env.instancing = scope.def(env.shared.extensions, '.angle_instanced_arrays');
                }
            }
            function emitProfile(env, scope, args, useScope, incrementCounter) {
                var shared = env.shared;
                var STATS = env.stats;
                var CURRENT_STATE = shared.current;
                var TIMER = shared.timer;
                var profileArg = args.profile;
                function perfCounter() {
                    if (typeof performance === 'undefined') {
                        return 'Date.now()';
                    }
                    else {
                        return 'performance.now()';
                    }
                }
                var CPU_START, QUERY_COUNTER;
                function emitProfileStart(block) {
                    CPU_START = scope.def();
                    block(CPU_START, '=', perfCounter(), ';');
                    if (typeof incrementCounter === 'string') {
                        block(STATS, '.count+=', incrementCounter, ';');
                    }
                    else {
                        block(STATS, '.count++;');
                    }
                    if (timer) {
                        if (useScope) {
                            QUERY_COUNTER = scope.def();
                            block(QUERY_COUNTER, '=', TIMER, '.getNumPendingQueries();');
                        }
                        else {
                            block(TIMER, '.beginQuery(', STATS, ');');
                        }
                    }
                }
                function emitProfileEnd(block) {
                    block(STATS, '.cpuTime+=', perfCounter(), '-', CPU_START, ';');
                    if (timer) {
                        if (useScope) {
                            block(TIMER, '.pushScopeStats(', QUERY_COUNTER, ',', TIMER, '.getNumPendingQueries(),', STATS, ');');
                        }
                        else {
                            block(TIMER, '.endQuery();');
                        }
                    }
                }
                function scopeProfile(value) {
                    var prev = scope.def(CURRENT_STATE, '.profile');
                    scope(CURRENT_STATE, '.profile=', value, ';');
                    scope.exit(CURRENT_STATE, '.profile=', prev, ';');
                }
                var USE_PROFILE;
                if (profileArg) {
                    if (isStatic(profileArg)) {
                        if (profileArg.enable) {
                            emitProfileStart(scope);
                            emitProfileEnd(scope.exit);
                            scopeProfile('true');
                        }
                        else {
                            scopeProfile('false');
                        }
                        return;
                    }
                    USE_PROFILE = profileArg.append(env, scope);
                    scopeProfile(USE_PROFILE);
                }
                else {
                    USE_PROFILE = scope.def(CURRENT_STATE, '.profile');
                }
                var start = env.block();
                emitProfileStart(start);
                scope('if(', USE_PROFILE, '){', start, '}');
                var end = env.block();
                emitProfileEnd(end);
                scope.exit('if(', USE_PROFILE, '){', end, '}');
            }
            function emitAttributes(env, scope, args, attributes, filter) {
                var shared = env.shared;
                function typeLength(x) {
                    switch (x) {
                        case GL_FLOAT_VEC2:
                        case GL_INT_VEC2:
                        case GL_BOOL_VEC2:
                            return 2;
                        case GL_FLOAT_VEC3:
                        case GL_INT_VEC3:
                        case GL_BOOL_VEC3:
                            return 3;
                        case GL_FLOAT_VEC4:
                        case GL_INT_VEC4:
                        case GL_BOOL_VEC4:
                            return 4;
                        default:
                            return 1;
                    }
                }
                function emitBindAttribute(ATTRIBUTE, size, record) {
                    var GL = shared.gl;
                    var LOCATION = scope.def(ATTRIBUTE, '.location');
                    var BINDING = scope.def(shared.attributes, '[', LOCATION, ']');
                    var STATE = record.state;
                    var BUFFER = record.buffer;
                    var CONST_COMPONENTS = [
                        record.x,
                        record.y,
                        record.z,
                        record.w
                    ];
                    var COMMON_KEYS = [
                        'buffer',
                        'normalized',
                        'offset',
                        'stride'
                    ];
                    function emitBuffer() {
                        scope('if(!', BINDING, '.buffer){', GL, '.enableVertexAttribArray(', LOCATION, ');}');
                        var TYPE = record.type;
                        var SIZE;
                        if (!record.size) {
                            SIZE = size;
                        }
                        else {
                            SIZE = scope.def(record.size, '||', size);
                        }
                        scope('if(', BINDING, '.type!==', TYPE, '||', BINDING, '.size!==', SIZE, '||', COMMON_KEYS.map(function (key) {
                            return BINDING + '.' + key + '!==' + record[key];
                        }).join('||'), '){', GL, '.bindBuffer(', GL_ARRAY_BUFFER$2, ',', BUFFER, '.buffer);', GL, '.vertexAttribPointer(', [
                            LOCATION,
                            SIZE,
                            TYPE,
                            record.normalized,
                            record.stride,
                            record.offset
                        ], ');', BINDING, '.type=', TYPE, ';', BINDING, '.size=', SIZE, ';', COMMON_KEYS.map(function (key) {
                            return BINDING + '.' + key + '=' + record[key] + ';';
                        }).join(''), '}');
                        if (extInstancing) {
                            var DIVISOR = record.divisor;
                            scope('if(', BINDING, '.divisor!==', DIVISOR, '){', env.instancing, '.vertexAttribDivisorANGLE(', [LOCATION, DIVISOR], ');', BINDING, '.divisor=', DIVISOR, ';}');
                        }
                    }
                    function emitConstant() {
                        scope('if(', BINDING, '.buffer){', GL, '.disableVertexAttribArray(', LOCATION, ');', BINDING, '.buffer=null;', '}if(', CUTE_COMPONENTS.map(function (c, i) {
                            return BINDING + '.' + c + '!==' + CONST_COMPONENTS[i];
                        }).join('||'), '){', GL, '.vertexAttrib4f(', LOCATION, ',', CONST_COMPONENTS, ');', CUTE_COMPONENTS.map(function (c, i) {
                            return BINDING + '.' + c + '=' + CONST_COMPONENTS[i] + ';';
                        }).join(''), '}');
                    }
                    if (STATE === ATTRIB_STATE_POINTER) {
                        emitBuffer();
                    }
                    else if (STATE === ATTRIB_STATE_CONSTANT) {
                        emitConstant();
                    }
                    else {
                        scope('if(', STATE, '===', ATTRIB_STATE_POINTER, '){');
                        emitBuffer();
                        scope('}else{');
                        emitConstant();
                        scope('}');
                    }
                }
                attributes.forEach(function (attribute) {
                    var name = attribute.name;
                    var arg = args.attributes[name];
                    var record;
                    if (arg) {
                        if (!filter(arg)) {
                            return;
                        }
                        record = arg.append(env, scope);
                    }
                    else {
                        if (!filter(SCOPE_DECL)) {
                            return;
                        }
                        var scopeAttrib = env.scopeAttrib(name);
                        check$1.optional(function () {
                            env.assert(scope, scopeAttrib + '.state', 'missing attribute ' + name);
                        });
                        record = {};
                        Object.keys(new AttributeRecord()).forEach(function (key) {
                            record[key] = scope.def(scopeAttrib, '.', key);
                        });
                    }
                    emitBindAttribute(env.link(attribute), typeLength(attribute.info.type), record);
                });
            }
            function emitUniforms(env, scope, args, uniforms, filter, isBatchInnerLoop) {
                var shared = env.shared;
                var GL = shared.gl;
                var definedArrUniforms = {};
                var infix;
                for (var i = 0; i < uniforms.length; ++i) {
                    var uniform = uniforms[i];
                    var name = uniform.name;
                    var type = uniform.info.type;
                    var size = uniform.info.size;
                    var arg = args.uniforms[name];
                    if (size > 1) {
                        // either foo[n] or foos, avoid define both
                        if (!arg) {
                            continue;
                        }
                        var arrUniformName = name.replace('[0]', '');
                        if (definedArrUniforms[arrUniformName]) {
                            continue;
                        }
                        definedArrUniforms[arrUniformName] = 1;
                    }
                    var UNIFORM = env.link(uniform);
                    var LOCATION = UNIFORM + '.location';
                    var VALUE;
                    if (arg) {
                        if (!filter(arg)) {
                            continue;
                        }
                        if (isStatic(arg)) {
                            var value = arg.value;
                            check$1.command(value !== null && typeof value !== 'undefined', 'missing uniform "' + name + '"', env.commandStr);
                            if (type === GL_SAMPLER_2D || type === GL_SAMPLER_CUBE) {
                                check$1.command(typeof value === 'function' &&
                                    ((type === GL_SAMPLER_2D &&
                                        (value._reglType === 'texture2d' ||
                                            value._reglType === 'framebuffer')) ||
                                        (type === GL_SAMPLER_CUBE &&
                                            (value._reglType === 'textureCube' ||
                                                value._reglType === 'framebufferCube'))), 'invalid texture for uniform ' + name, env.commandStr);
                                var TEX_VALUE = env.link(value._texture || value.color[0]._texture);
                                scope(GL, '.uniform1i(', LOCATION, ',', TEX_VALUE + '.bind());');
                                scope.exit(TEX_VALUE, '.unbind();');
                            }
                            else if (type === GL_FLOAT_MAT2 ||
                                type === GL_FLOAT_MAT3 ||
                                type === GL_FLOAT_MAT4) {
                                check$1.optional(function () {
                                    check$1.command(isArrayLike(value), 'invalid matrix for uniform ' + name, env.commandStr);
                                    check$1.command((type === GL_FLOAT_MAT2 && value.length === 4) ||
                                        (type === GL_FLOAT_MAT3 && value.length === 9) ||
                                        (type === GL_FLOAT_MAT4 && value.length === 16), 'invalid length for matrix uniform ' + name, env.commandStr);
                                });
                                var MAT_VALUE = env.global.def('new Float32Array([' +
                                    Array.prototype.slice.call(value) + '])');
                                var dim = 2;
                                if (type === GL_FLOAT_MAT3) {
                                    dim = 3;
                                }
                                else if (type === GL_FLOAT_MAT4) {
                                    dim = 4;
                                }
                                scope(GL, '.uniformMatrix', dim, 'fv(', LOCATION, ',false,', MAT_VALUE, ');');
                            }
                            else {
                                switch (type) {
                                    case GL_FLOAT$8:
                                        if (size === 1) {
                                            check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                                        }
                                        else {
                                            check$1.command(isArrayLike(value) && (value.length === size), 'uniform ' + name, env.commandStr);
                                        }
                                        infix = '1f';
                                        break;
                                    case GL_FLOAT_VEC2:
                                        check$1.command(isArrayLike(value) && (value.length && value.length % 2 === 0 && value.length <= size * 2), 'uniform ' + name, env.commandStr);
                                        infix = '2f';
                                        break;
                                    case GL_FLOAT_VEC3:
                                        check$1.command(isArrayLike(value) && (value.length && value.length % 3 === 0 && value.length <= size * 3), 'uniform ' + name, env.commandStr);
                                        infix = '3f';
                                        break;
                                    case GL_FLOAT_VEC4:
                                        check$1.command(isArrayLike(value) && (value.length && value.length % 4 === 0 && value.length <= size * 4), 'uniform ' + name, env.commandStr);
                                        infix = '4f';
                                        break;
                                    case GL_BOOL:
                                        if (size === 1) {
                                            check$1.commandType(value, 'boolean', 'uniform ' + name, env.commandStr);
                                        }
                                        else {
                                            check$1.command(isArrayLike(value) && (value.length === size), 'uniform ' + name, env.commandStr);
                                        }
                                        infix = '1i';
                                        break;
                                    case GL_INT$3:
                                        if (size === 1) {
                                            check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                                        }
                                        else {
                                            check$1.command(isArrayLike(value) && (value.length === size), 'uniform ' + name, env.commandStr);
                                        }
                                        infix = '1i';
                                        break;
                                    case GL_BOOL_VEC2:
                                        check$1.command(isArrayLike(value) && (value.length && value.length % 2 === 0 && value.length <= size * 2), 'uniform ' + name, env.commandStr);
                                        infix = '2i';
                                        break;
                                    case GL_INT_VEC2:
                                        check$1.command(isArrayLike(value) && (value.length && value.length % 2 === 0 && value.length <= size * 2), 'uniform ' + name, env.commandStr);
                                        infix = '2i';
                                        break;
                                    case GL_BOOL_VEC3:
                                        check$1.command(isArrayLike(value) && (value.length && value.length % 3 === 0 && value.length <= size * 3), 'uniform ' + name, env.commandStr);
                                        infix = '3i';
                                        break;
                                    case GL_INT_VEC3:
                                        check$1.command(isArrayLike(value) && (value.length && value.length % 3 === 0 && value.length <= size * 3), 'uniform ' + name, env.commandStr);
                                        infix = '3i';
                                        break;
                                    case GL_BOOL_VEC4:
                                        check$1.command(isArrayLike(value) && (value.length && value.length % 4 === 0 && value.length <= size * 4), 'uniform ' + name, env.commandStr);
                                        infix = '4i';
                                        break;
                                    case GL_INT_VEC4:
                                        check$1.command(isArrayLike(value) && (value.length && value.length % 4 === 0 && value.length <= size * 4), 'uniform ' + name, env.commandStr);
                                        infix = '4i';
                                        break;
                                }
                                if (size > 1) {
                                    infix += 'v';
                                    value = env.global.def('[' +
                                        Array.prototype.slice.call(value) + ']');
                                }
                                else {
                                    value = isArrayLike(value) ? Array.prototype.slice.call(value) : value;
                                }
                                scope(GL, '.uniform', infix, '(', LOCATION, ',', value, ');');
                            }
                            continue;
                        }
                        else {
                            VALUE = arg.append(env, scope);
                        }
                    }
                    else {
                        if (!filter(SCOPE_DECL)) {
                            continue;
                        }
                        VALUE = scope.def(shared.uniforms, '[', stringStore.id(name), ']');
                    }
                    if (type === GL_SAMPLER_2D) {
                        check$1(!Array.isArray(VALUE), 'must specify a scalar prop for textures');
                        scope('if(', VALUE, '&&', VALUE, '._reglType==="framebuffer"){', VALUE, '=', VALUE, '.color[0];', '}');
                    }
                    else if (type === GL_SAMPLER_CUBE) {
                        check$1(!Array.isArray(VALUE), 'must specify a scalar prop for cube maps');
                        scope('if(', VALUE, '&&', VALUE, '._reglType==="framebufferCube"){', VALUE, '=', VALUE, '.color[0];', '}');
                    }
                    // perform type validation
                    check$1.optional(function () {
                        function emitCheck(pred, message) {
                            env.assert(scope, pred, 'bad data or missing for uniform "' + name + '".  ' + message);
                        }
                        function checkType(type, size) {
                            if (size === 1) {
                                check$1(!Array.isArray(VALUE), 'must not specify an array type for uniform');
                            }
                            emitCheck('Array.isArray(' + VALUE + ') && typeof ' + VALUE + '[0]===" ' + type + '"' +
                                ' || typeof ' + VALUE + '==="' + type + '"', 'invalid type, expected ' + type);
                        }
                        function checkVector(n, type, size) {
                            if (Array.isArray(VALUE)) {
                                check$1(VALUE.length && VALUE.length % n === 0 && VALUE.length <= n * size, 'must have length of ' + (size === 1 ? '' : 'n * ') + n);
                            }
                            else {
                                emitCheck(shared.isArrayLike + '(' + VALUE + ')&&' + VALUE + '.length && ' + VALUE + '.length % ' + n + ' === 0' +
                                    ' && ' + VALUE + '.length<=' + n * size, 'invalid vector, should have length of ' + (size === 1 ? '' : 'n * ') + n, env.commandStr);
                            }
                        }
                        function checkTexture(target) {
                            check$1(!Array.isArray(VALUE), 'must not specify a value type');
                            emitCheck('typeof ' + VALUE + '==="function"&&' +
                                VALUE + '._reglType==="texture' +
                                (target === GL_TEXTURE_2D$3 ? '2d' : 'Cube') + '"', 'invalid texture type', env.commandStr);
                        }
                        switch (type) {
                            case GL_INT$3:
                                checkType('number', size);
                                break;
                            case GL_INT_VEC2:
                                checkVector(2, 'number', size);
                                break;
                            case GL_INT_VEC3:
                                checkVector(3, 'number', size);
                                break;
                            case GL_INT_VEC4:
                                checkVector(4, 'number', size);
                                break;
                            case GL_FLOAT$8:
                                checkType('number', size);
                                break;
                            case GL_FLOAT_VEC2:
                                checkVector(2, 'number', size);
                                break;
                            case GL_FLOAT_VEC3:
                                checkVector(3, 'number', size);
                                break;
                            case GL_FLOAT_VEC4:
                                checkVector(4, 'number', size);
                                break;
                            case GL_BOOL:
                                checkType('boolean', size);
                                break;
                            case GL_BOOL_VEC2:
                                checkVector(2, 'boolean', size);
                                break;
                            case GL_BOOL_VEC3:
                                checkVector(3, 'boolean', size);
                                break;
                            case GL_BOOL_VEC4:
                                checkVector(4, 'boolean', size);
                                break;
                            case GL_FLOAT_MAT2:
                                checkVector(4, 'number', size);
                                break;
                            case GL_FLOAT_MAT3:
                                checkVector(9, 'number', size);
                                break;
                            case GL_FLOAT_MAT4:
                                checkVector(16, 'number', size);
                                break;
                            case GL_SAMPLER_2D:
                                checkTexture(GL_TEXTURE_2D$3);
                                break;
                            case GL_SAMPLER_CUBE:
                                checkTexture(GL_TEXTURE_CUBE_MAP$2);
                                break;
                        }
                    });
                    var unroll = 1;
                    switch (type) {
                        case GL_SAMPLER_2D:
                        case GL_SAMPLER_CUBE:
                            var TEX = scope.def(VALUE, '._texture');
                            scope(GL, '.uniform1i(', LOCATION, ',', TEX, '.bind());');
                            scope.exit(TEX, '.unbind();');
                            continue;
                        case GL_INT$3:
                        case GL_BOOL:
                            infix = '1i';
                            break;
                        case GL_INT_VEC2:
                        case GL_BOOL_VEC2:
                            infix = '2i';
                            unroll = 2;
                            break;
                        case GL_INT_VEC3:
                        case GL_BOOL_VEC3:
                            infix = '3i';
                            unroll = 3;
                            break;
                        case GL_INT_VEC4:
                        case GL_BOOL_VEC4:
                            infix = '4i';
                            unroll = 4;
                            break;
                        case GL_FLOAT$8:
                            infix = '1f';
                            break;
                        case GL_FLOAT_VEC2:
                            infix = '2f';
                            unroll = 2;
                            break;
                        case GL_FLOAT_VEC3:
                            infix = '3f';
                            unroll = 3;
                            break;
                        case GL_FLOAT_VEC4:
                            infix = '4f';
                            unroll = 4;
                            break;
                        case GL_FLOAT_MAT2:
                            infix = 'Matrix2fv';
                            break;
                        case GL_FLOAT_MAT3:
                            infix = 'Matrix3fv';
                            break;
                        case GL_FLOAT_MAT4:
                            infix = 'Matrix4fv';
                            break;
                    }
                    if (infix.indexOf('Matrix') === -1 && size > 1) {
                        infix += 'v';
                        unroll = 1;
                    }
                    if (infix.charAt(0) === 'M') {
                        scope(GL, '.uniform', infix, '(', LOCATION, ',');
                        var matSize = Math.pow(type - GL_FLOAT_MAT2 + 2, 2);
                        var STORAGE = env.global.def('new Float32Array(', matSize, ')');
                        if (Array.isArray(VALUE)) {
                            scope('false,(', loop(matSize, function (i) {
                                return STORAGE + '[' + i + ']=' + VALUE[i];
                            }), ',', STORAGE, ')');
                        }
                        else {
                            scope('false,(Array.isArray(', VALUE, ')||', VALUE, ' instanceof Float32Array)?', VALUE, ':(', loop(matSize, function (i) {
                                return STORAGE + '[' + i + ']=' + VALUE + '[' + i + ']';
                            }), ',', STORAGE, ')');
                        }
                        scope(');');
                    }
                    else if (unroll > 1) {
                        var prev = [];
                        var cur = [];
                        for (var j = 0; j < unroll; ++j) {
                            if (Array.isArray(VALUE)) {
                                cur.push(VALUE[j]);
                            }
                            else {
                                cur.push(scope.def(VALUE + '[' + j + ']'));
                            }
                            if (isBatchInnerLoop) {
                                prev.push(scope.def());
                            }
                        }
                        if (isBatchInnerLoop) {
                            scope('if(!', env.batchId, '||', prev.map(function (p, i) {
                                return p + '!==' + cur[i];
                            }).join('||'), '){', prev.map(function (p, i) {
                                return p + '=' + cur[i] + ';';
                            }).join(''));
                        }
                        scope(GL, '.uniform', infix, '(', LOCATION, ',', cur.join(','), ');');
                        if (isBatchInnerLoop) {
                            scope('}');
                        }
                    }
                    else {
                        check$1(!Array.isArray(VALUE), 'uniform value must not be an array');
                        if (isBatchInnerLoop) {
                            var prevS = scope.def();
                            scope('if(!', env.batchId, '||', prevS, '!==', VALUE, '){', prevS, '=', VALUE, ';');
                        }
                        scope(GL, '.uniform', infix, '(', LOCATION, ',', VALUE, ');');
                        if (isBatchInnerLoop) {
                            scope('}');
                        }
                    }
                }
            }
            function emitDraw(env, outer, inner, args) {
                var shared = env.shared;
                var GL = shared.gl;
                var DRAW_STATE = shared.draw;
                var drawOptions = args.draw;
                function emitElements() {
                    var defn = drawOptions.elements;
                    var ELEMENTS;
                    var scope = outer;
                    if (defn) {
                        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
                            scope = inner;
                        }
                        ELEMENTS = defn.append(env, scope);
                        if (drawOptions.elementsActive) {
                            scope('if(' + ELEMENTS + ')' +
                                GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$2 + ',' + ELEMENTS + '.buffer.buffer);');
                        }
                    }
                    else {
                        ELEMENTS = scope.def();
                        scope(ELEMENTS, '=', DRAW_STATE, '.', S_ELEMENTS, ';', 'if(', ELEMENTS, '){', GL, '.bindBuffer(', GL_ELEMENT_ARRAY_BUFFER$2, ',', ELEMENTS, '.buffer.buffer);}', 'else if(', shared.vao, '.currentVAO){', ELEMENTS, '=', env.shared.elements + '.getElements(' + shared.vao, '.currentVAO.elements);', (!extVertexArrays ? 'if(' + ELEMENTS + ')' + GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$2 + ',' + ELEMENTS + '.buffer.buffer);' : ''), '}');
                    }
                    return ELEMENTS;
                }
                function emitCount() {
                    var defn = drawOptions.count;
                    var COUNT;
                    var scope = outer;
                    if (defn) {
                        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
                            scope = inner;
                        }
                        COUNT = defn.append(env, scope);
                        check$1.optional(function () {
                            if (defn.MISSING) {
                                env.assert(outer, 'false', 'missing vertex count');
                            }
                            if (defn.DYNAMIC) {
                                env.assert(scope, COUNT + '>=0', 'missing vertex count');
                            }
                        });
                    }
                    else {
                        COUNT = scope.def(DRAW_STATE, '.', S_COUNT);
                        check$1.optional(function () {
                            env.assert(scope, COUNT + '>=0', 'missing vertex count');
                        });
                    }
                    return COUNT;
                }
                var ELEMENTS = emitElements();
                function emitValue(name) {
                    var defn = drawOptions[name];
                    if (defn) {
                        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
                            return defn.append(env, inner);
                        }
                        else {
                            return defn.append(env, outer);
                        }
                    }
                    else {
                        return outer.def(DRAW_STATE, '.', name);
                    }
                }
                var PRIMITIVE = emitValue(S_PRIMITIVE);
                var OFFSET = emitValue(S_OFFSET);
                var COUNT = emitCount();
                if (typeof COUNT === 'number') {
                    if (COUNT === 0) {
                        return;
                    }
                }
                else {
                    inner('if(', COUNT, '){');
                    inner.exit('}');
                }
                var INSTANCES, EXT_INSTANCING;
                if (extInstancing) {
                    INSTANCES = emitValue(S_INSTANCES);
                    EXT_INSTANCING = env.instancing;
                }
                var ELEMENT_TYPE = ELEMENTS + '.type';
                var elementsStatic = drawOptions.elements && isStatic(drawOptions.elements) && !drawOptions.vaoActive;
                function emitInstancing() {
                    function drawElements() {
                        inner(EXT_INSTANCING, '.drawElementsInstancedANGLE(', [
                            PRIMITIVE,
                            COUNT,
                            ELEMENT_TYPE,
                            OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)',
                            INSTANCES
                        ], ');');
                    }
                    function drawArrays() {
                        inner(EXT_INSTANCING, '.drawArraysInstancedANGLE(', [PRIMITIVE, OFFSET, COUNT, INSTANCES], ');');
                    }
                    if (ELEMENTS && ELEMENTS !== 'null') {
                        if (!elementsStatic) {
                            inner('if(', ELEMENTS, '){');
                            drawElements();
                            inner('}else{');
                            drawArrays();
                            inner('}');
                        }
                        else {
                            drawElements();
                        }
                    }
                    else {
                        drawArrays();
                    }
                }
                function emitRegular() {
                    function drawElements() {
                        inner(GL + '.drawElements(' + [
                            PRIMITIVE,
                            COUNT,
                            ELEMENT_TYPE,
                            OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)'
                        ] + ');');
                    }
                    function drawArrays() {
                        inner(GL + '.drawArrays(' + [PRIMITIVE, OFFSET, COUNT] + ');');
                    }
                    if (ELEMENTS && ELEMENTS !== 'null') {
                        if (!elementsStatic) {
                            inner('if(', ELEMENTS, '){');
                            drawElements();
                            inner('}else{');
                            drawArrays();
                            inner('}');
                        }
                        else {
                            drawElements();
                        }
                    }
                    else {
                        drawArrays();
                    }
                }
                if (extInstancing && (typeof INSTANCES !== 'number' || INSTANCES >= 0)) {
                    if (typeof INSTANCES === 'string') {
                        inner('if(', INSTANCES, '>0){');
                        emitInstancing();
                        inner('}else if(', INSTANCES, '<0){');
                        emitRegular();
                        inner('}');
                    }
                    else {
                        emitInstancing();
                    }
                }
                else {
                    emitRegular();
                }
            }
            function createBody(emitBody, parentEnv, args, program, count) {
                var env = createREGLEnvironment();
                var scope = env.proc('body', count);
                check$1.optional(function () {
                    env.commandStr = parentEnv.commandStr;
                    env.command = env.link(parentEnv.commandStr);
                });
                if (extInstancing) {
                    env.instancing = scope.def(env.shared.extensions, '.angle_instanced_arrays');
                }
                emitBody(env, scope, args, program);
                return env.compile().body;
            }
            // ===================================================
            // ===================================================
            // DRAW PROC
            // ===================================================
            // ===================================================
            function emitDrawBody(env, draw, args, program) {
                injectExtensions(env, draw);
                if (args.useVAO) {
                    if (args.drawVAO) {
                        draw(env.shared.vao, '.setVAO(', args.drawVAO.append(env, draw), ');');
                    }
                    else {
                        draw(env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');
                    }
                }
                else {
                    draw(env.shared.vao, '.setVAO(null);');
                    emitAttributes(env, draw, args, program.attributes, function () {
                        return true;
                    });
                }
                emitUniforms(env, draw, args, program.uniforms, function () {
                    return true;
                }, false);
                emitDraw(env, draw, draw, args);
            }
            function emitDrawProc(env, args) {
                var draw = env.proc('draw', 1);
                injectExtensions(env, draw);
                emitContext(env, draw, args.context);
                emitPollFramebuffer(env, draw, args.framebuffer);
                emitPollState(env, draw, args);
                emitSetOptions(env, draw, args.state);
                emitProfile(env, draw, args, false, true);
                var program = args.shader.progVar.append(env, draw);
                draw(env.shared.gl, '.useProgram(', program, '.program);');
                if (args.shader.program) {
                    emitDrawBody(env, draw, args, args.shader.program);
                }
                else {
                    draw(env.shared.vao, '.setVAO(null);');
                    var drawCache = env.global.def('{}');
                    var PROG_ID = draw.def(program, '.id');
                    var CACHED_PROC = draw.def(drawCache, '[', PROG_ID, ']');
                    draw(env.cond(CACHED_PROC)
                        .then(CACHED_PROC, '.call(this,a0);')
                        .else(CACHED_PROC, '=', drawCache, '[', PROG_ID, ']=', env.link(function (program) {
                        return createBody(emitDrawBody, env, args, program, 1);
                    }), '(', program, ');', CACHED_PROC, '.call(this,a0);'));
                }
                if (Object.keys(args.state).length > 0) {
                    draw(env.shared.current, '.dirty=true;');
                }
                if (env.shared.vao) {
                    draw(env.shared.vao, '.setVAO(null);');
                }
            }
            // ===================================================
            // ===================================================
            // BATCH PROC
            // ===================================================
            // ===================================================
            function emitBatchDynamicShaderBody(env, scope, args, program) {
                env.batchId = 'a1';
                injectExtensions(env, scope);
                function all() {
                    return true;
                }
                emitAttributes(env, scope, args, program.attributes, all);
                emitUniforms(env, scope, args, program.uniforms, all, false);
                emitDraw(env, scope, scope, args);
            }
            function emitBatchBody(env, scope, args, program) {
                injectExtensions(env, scope);
                var contextDynamic = args.contextDep;
                var BATCH_ID = scope.def();
                var PROP_LIST = 'a0';
                var NUM_PROPS = 'a1';
                var PROPS = scope.def();
                env.shared.props = PROPS;
                env.batchId = BATCH_ID;
                var outer = env.scope();
                var inner = env.scope();
                scope(outer.entry, 'for(', BATCH_ID, '=0;', BATCH_ID, '<', NUM_PROPS, ';++', BATCH_ID, '){', PROPS, '=', PROP_LIST, '[', BATCH_ID, '];', inner, '}', outer.exit);
                function isInnerDefn(defn) {
                    return ((defn.contextDep && contextDynamic) || defn.propDep);
                }
                function isOuterDefn(defn) {
                    return !isInnerDefn(defn);
                }
                if (args.needsContext) {
                    emitContext(env, inner, args.context);
                }
                if (args.needsFramebuffer) {
                    emitPollFramebuffer(env, inner, args.framebuffer);
                }
                emitSetOptions(env, inner, args.state, isInnerDefn);
                if (args.profile && isInnerDefn(args.profile)) {
                    emitProfile(env, inner, args, false, true);
                }
                if (!program) {
                    var progCache = env.global.def('{}');
                    var PROGRAM = args.shader.progVar.append(env, inner);
                    var PROG_ID = inner.def(PROGRAM, '.id');
                    var CACHED_PROC = inner.def(progCache, '[', PROG_ID, ']');
                    inner(env.shared.gl, '.useProgram(', PROGRAM, '.program);', 'if(!', CACHED_PROC, '){', CACHED_PROC, '=', progCache, '[', PROG_ID, ']=', env.link(function (program) {
                        return createBody(emitBatchDynamicShaderBody, env, args, program, 2);
                    }), '(', PROGRAM, ');}', CACHED_PROC, '.call(this,a0[', BATCH_ID, '],', BATCH_ID, ');');
                }
                else {
                    if (args.useVAO) {
                        if (args.drawVAO) {
                            if (isInnerDefn(args.drawVAO)) {
                                // vao is a prop
                                inner(env.shared.vao, '.setVAO(', args.drawVAO.append(env, inner), ');');
                            }
                            else {
                                // vao is invariant
                                outer(env.shared.vao, '.setVAO(', args.drawVAO.append(env, outer), ');');
                            }
                        }
                        else {
                            // scoped vao binding
                            outer(env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');
                        }
                    }
                    else {
                        outer(env.shared.vao, '.setVAO(null);');
                        emitAttributes(env, outer, args, program.attributes, isOuterDefn);
                        emitAttributes(env, inner, args, program.attributes, isInnerDefn);
                    }
                    emitUniforms(env, outer, args, program.uniforms, isOuterDefn, false);
                    emitUniforms(env, inner, args, program.uniforms, isInnerDefn, true);
                    emitDraw(env, outer, inner, args);
                }
            }
            function emitBatchProc(env, args) {
                var batch = env.proc('batch', 2);
                env.batchId = '0';
                injectExtensions(env, batch);
                // Check if any context variables depend on props
                var contextDynamic = false;
                var needsContext = true;
                Object.keys(args.context).forEach(function (name) {
                    contextDynamic = contextDynamic || args.context[name].propDep;
                });
                if (!contextDynamic) {
                    emitContext(env, batch, args.context);
                    needsContext = false;
                }
                // framebuffer state affects framebufferWidth/height context vars
                var framebuffer = args.framebuffer;
                var needsFramebuffer = false;
                if (framebuffer) {
                    if (framebuffer.propDep) {
                        contextDynamic = needsFramebuffer = true;
                    }
                    else if (framebuffer.contextDep && contextDynamic) {
                        needsFramebuffer = true;
                    }
                    if (!needsFramebuffer) {
                        emitPollFramebuffer(env, batch, framebuffer);
                    }
                }
                else {
                    emitPollFramebuffer(env, batch, null);
                }
                // viewport is weird because it can affect context vars
                if (args.state.viewport && args.state.viewport.propDep) {
                    contextDynamic = true;
                }
                function isInnerDefn(defn) {
                    return (defn.contextDep && contextDynamic) || defn.propDep;
                }
                // set webgl options
                emitPollState(env, batch, args);
                emitSetOptions(env, batch, args.state, function (defn) {
                    return !isInnerDefn(defn);
                });
                if (!args.profile || !isInnerDefn(args.profile)) {
                    emitProfile(env, batch, args, false, 'a1');
                }
                // Save these values to args so that the batch body routine can use them
                args.contextDep = contextDynamic;
                args.needsContext = needsContext;
                args.needsFramebuffer = needsFramebuffer;
                // determine if shader is dynamic
                var progDefn = args.shader.progVar;
                if ((progDefn.contextDep && contextDynamic) || progDefn.propDep) {
                    emitBatchBody(env, batch, args, null);
                }
                else {
                    var PROGRAM = progDefn.append(env, batch);
                    batch(env.shared.gl, '.useProgram(', PROGRAM, '.program);');
                    if (args.shader.program) {
                        emitBatchBody(env, batch, args, args.shader.program);
                    }
                    else {
                        batch(env.shared.vao, '.setVAO(null);');
                        var batchCache = env.global.def('{}');
                        var PROG_ID = batch.def(PROGRAM, '.id');
                        var CACHED_PROC = batch.def(batchCache, '[', PROG_ID, ']');
                        batch(env.cond(CACHED_PROC)
                            .then(CACHED_PROC, '.call(this,a0,a1);')
                            .else(CACHED_PROC, '=', batchCache, '[', PROG_ID, ']=', env.link(function (program) {
                            return createBody(emitBatchBody, env, args, program, 2);
                        }), '(', PROGRAM, ');', CACHED_PROC, '.call(this,a0,a1);'));
                    }
                }
                if (Object.keys(args.state).length > 0) {
                    batch(env.shared.current, '.dirty=true;');
                }
                if (env.shared.vao) {
                    batch(env.shared.vao, '.setVAO(null);');
                }
            }
            // ===================================================
            // ===================================================
            // SCOPE COMMAND
            // ===================================================
            // ===================================================
            function emitScopeProc(env, args) {
                var scope = env.proc('scope', 3);
                env.batchId = 'a2';
                var shared = env.shared;
                var CURRENT_STATE = shared.current;
                emitContext(env, scope, args.context);
                if (args.framebuffer) {
                    args.framebuffer.append(env, scope);
                }
                sortState(Object.keys(args.state)).forEach(function (name) {
                    var defn = args.state[name];
                    var value = defn.append(env, scope);
                    if (isArrayLike(value)) {
                        value.forEach(function (v, i) {
                            scope.set(env.next[name], '[' + i + ']', v);
                        });
                    }
                    else {
                        scope.set(shared.next, '.' + name, value);
                    }
                });
                emitProfile(env, scope, args, true, true);
                [S_ELEMENTS, S_OFFSET, S_COUNT, S_INSTANCES, S_PRIMITIVE].forEach(function (opt) {
                    var variable = args.draw[opt];
                    if (!variable) {
                        return;
                    }
                    scope.set(shared.draw, '.' + opt, '' + variable.append(env, scope));
                });
                Object.keys(args.uniforms).forEach(function (opt) {
                    var value = args.uniforms[opt].append(env, scope);
                    if (Array.isArray(value)) {
                        value = '[' + value.join() + ']';
                    }
                    scope.set(shared.uniforms, '[' + stringStore.id(opt) + ']', value);
                });
                Object.keys(args.attributes).forEach(function (name) {
                    var record = args.attributes[name].append(env, scope);
                    var scopeAttrib = env.scopeAttrib(name);
                    Object.keys(new AttributeRecord()).forEach(function (prop) {
                        scope.set(scopeAttrib, '.' + prop, record[prop]);
                    });
                });
                if (args.scopeVAO) {
                    scope.set(shared.vao, '.targetVAO', args.scopeVAO.append(env, scope));
                }
                function saveShader(name) {
                    var shader = args.shader[name];
                    if (shader) {
                        scope.set(shared.shader, '.' + name, shader.append(env, scope));
                    }
                }
                saveShader(S_VERT);
                saveShader(S_FRAG);
                if (Object.keys(args.state).length > 0) {
                    scope(CURRENT_STATE, '.dirty=true;');
                    scope.exit(CURRENT_STATE, '.dirty=true;');
                }
                scope('a1(', env.shared.context, ',a0,', env.batchId, ');');
            }
            function isDynamicObject(object) {
                if (typeof object !== 'object' || isArrayLike(object)) {
                    return;
                }
                var props = Object.keys(object);
                for (var i = 0; i < props.length; ++i) {
                    if (dynamic.isDynamic(object[props[i]])) {
                        return true;
                    }
                }
                return false;
            }
            function splatObject(env, options, name) {
                var object = options.static[name];
                if (!object || !isDynamicObject(object)) {
                    return;
                }
                var globals = env.global;
                var keys = Object.keys(object);
                var thisDep = false;
                var contextDep = false;
                var propDep = false;
                var objectRef = env.global.def('{}');
                keys.forEach(function (key) {
                    var value = object[key];
                    if (dynamic.isDynamic(value)) {
                        if (typeof value === 'function') {
                            value = object[key] = dynamic.unbox(value);
                        }
                        var deps = createDynamicDecl(value, null);
                        thisDep = thisDep || deps.thisDep;
                        propDep = propDep || deps.propDep;
                        contextDep = contextDep || deps.contextDep;
                    }
                    else {
                        globals(objectRef, '.', key, '=');
                        switch (typeof value) {
                            case 'number':
                                globals(value);
                                break;
                            case 'string':
                                globals('"', value, '"');
                                break;
                            case 'object':
                                if (Array.isArray(value)) {
                                    globals('[', value.join(), ']');
                                }
                                break;
                            default:
                                globals(env.link(value));
                                break;
                        }
                        globals(';');
                    }
                });
                function appendBlock(env, block) {
                    keys.forEach(function (key) {
                        var value = object[key];
                        if (!dynamic.isDynamic(value)) {
                            return;
                        }
                        var ref = env.invoke(block, value);
                        block(objectRef, '.', key, '=', ref, ';');
                    });
                }
                options.dynamic[name] = new dynamic.DynamicVariable(DYN_THUNK, {
                    thisDep: thisDep,
                    contextDep: contextDep,
                    propDep: propDep,
                    ref: objectRef,
                    append: appendBlock
                });
                delete options.static[name];
            }
            // ===========================================================================
            // ===========================================================================
            // MAIN DRAW COMMAND
            // ===========================================================================
            // ===========================================================================
            function compileCommand(options, attributes, uniforms, context, stats) {
                var env = createREGLEnvironment();
                // link stats, so that we can easily access it in the program.
                env.stats = env.link(stats);
                // splat options and attributes to allow for dynamic nested properties
                Object.keys(attributes.static).forEach(function (key) {
                    splatObject(env, attributes, key);
                });
                NESTED_OPTIONS.forEach(function (name) {
                    splatObject(env, options, name);
                });
                var args = parseArguments(options, attributes, uniforms, context, env);
                emitDrawProc(env, args);
                emitScopeProc(env, args);
                emitBatchProc(env, args);
                return extend(env.compile(), {
                    destroy: function () {
                        args.shader.program.destroy();
                    }
                });
            }
            // ===========================================================================
            // ===========================================================================
            // POLL / REFRESH
            // ===========================================================================
            // ===========================================================================
            return {
                next: nextState,
                current: currentState,
                procs: (function () {
                    var env = createREGLEnvironment();
                    var poll = env.proc('poll');
                    var refresh = env.proc('refresh');
                    var common = env.block();
                    poll(common);
                    refresh(common);
                    var shared = env.shared;
                    var GL = shared.gl;
                    var NEXT_STATE = shared.next;
                    var CURRENT_STATE = shared.current;
                    common(CURRENT_STATE, '.dirty=false;');
                    emitPollFramebuffer(env, poll);
                    emitPollFramebuffer(env, refresh, null, true);
                    // Refresh updates all attribute state changes
                    var INSTANCING;
                    if (extInstancing) {
                        INSTANCING = env.link(extInstancing);
                    }
                    // update vertex array bindings
                    if (extensions.oes_vertex_array_object) {
                        refresh(env.link(extensions.oes_vertex_array_object), '.bindVertexArrayOES(null);');
                    }
                    for (var i = 0; i < limits.maxAttributes; ++i) {
                        var BINDING = refresh.def(shared.attributes, '[', i, ']');
                        var ifte = env.cond(BINDING, '.buffer');
                        ifte.then(GL, '.enableVertexAttribArray(', i, ');', GL, '.bindBuffer(', GL_ARRAY_BUFFER$2, ',', BINDING, '.buffer.buffer);', GL, '.vertexAttribPointer(', i, ',', BINDING, '.size,', BINDING, '.type,', BINDING, '.normalized,', BINDING, '.stride,', BINDING, '.offset);').else(GL, '.disableVertexAttribArray(', i, ');', GL, '.vertexAttrib4f(', i, ',', BINDING, '.x,', BINDING, '.y,', BINDING, '.z,', BINDING, '.w);', BINDING, '.buffer=null;');
                        refresh(ifte);
                        if (extInstancing) {
                            refresh(INSTANCING, '.vertexAttribDivisorANGLE(', i, ',', BINDING, '.divisor);');
                        }
                    }
                    refresh(env.shared.vao, '.currentVAO=null;', env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');
                    Object.keys(GL_FLAGS).forEach(function (flag) {
                        var cap = GL_FLAGS[flag];
                        var NEXT = common.def(NEXT_STATE, '.', flag);
                        var block = env.block();
                        block('if(', NEXT, '){', GL, '.enable(', cap, ')}else{', GL, '.disable(', cap, ')}', CURRENT_STATE, '.', flag, '=', NEXT, ';');
                        refresh(block);
                        poll('if(', NEXT, '!==', CURRENT_STATE, '.', flag, '){', block, '}');
                    });
                    Object.keys(GL_VARIABLES).forEach(function (name) {
                        var func = GL_VARIABLES[name];
                        var init = currentState[name];
                        var NEXT, CURRENT;
                        var block = env.block();
                        block(GL, '.', func, '(');
                        if (isArrayLike(init)) {
                            var n = init.length;
                            NEXT = env.global.def(NEXT_STATE, '.', name);
                            CURRENT = env.global.def(CURRENT_STATE, '.', name);
                            block(loop(n, function (i) {
                                return NEXT + '[' + i + ']';
                            }), ');', loop(n, function (i) {
                                return CURRENT + '[' + i + ']=' + NEXT + '[' + i + '];';
                            }).join(''));
                            poll('if(', loop(n, function (i) {
                                return NEXT + '[' + i + ']!==' + CURRENT + '[' + i + ']';
                            }).join('||'), '){', block, '}');
                        }
                        else {
                            NEXT = common.def(NEXT_STATE, '.', name);
                            CURRENT = common.def(CURRENT_STATE, '.', name);
                            block(NEXT, ');', CURRENT_STATE, '.', name, '=', NEXT, ';');
                            poll('if(', NEXT, '!==', CURRENT, '){', block, '}');
                        }
                        refresh(block);
                    });
                    return env.compile();
                })(),
                compile: compileCommand
            };
        }
        function stats() {
            return {
                vaoCount: 0,
                bufferCount: 0,
                elementsCount: 0,
                framebufferCount: 0,
                shaderCount: 0,
                textureCount: 0,
                cubeCount: 0,
                renderbufferCount: 0,
                maxTextureUnits: 0
            };
        }
        var GL_QUERY_RESULT_EXT = 0x8866;
        var GL_QUERY_RESULT_AVAILABLE_EXT = 0x8867;
        var GL_TIME_ELAPSED_EXT = 0x88BF;
        var createTimer = function (gl, extensions) {
            if (!extensions.ext_disjoint_timer_query) {
                return null;
            }
            // QUERY POOL BEGIN
            var queryPool = [];
            function allocQuery() {
                return queryPool.pop() || extensions.ext_disjoint_timer_query.createQueryEXT();
            }
            function freeQuery(query) {
                queryPool.push(query);
            }
            // QUERY POOL END
            var pendingQueries = [];
            function beginQuery(stats) {
                var query = allocQuery();
                extensions.ext_disjoint_timer_query.beginQueryEXT(GL_TIME_ELAPSED_EXT, query);
                pendingQueries.push(query);
                pushScopeStats(pendingQueries.length - 1, pendingQueries.length, stats);
            }
            function endQuery() {
                extensions.ext_disjoint_timer_query.endQueryEXT(GL_TIME_ELAPSED_EXT);
            }
            //
            // Pending stats pool.
            //
            function PendingStats() {
                this.startQueryIndex = -1;
                this.endQueryIndex = -1;
                this.sum = 0;
                this.stats = null;
            }
            var pendingStatsPool = [];
            function allocPendingStats() {
                return pendingStatsPool.pop() || new PendingStats();
            }
            function freePendingStats(pendingStats) {
                pendingStatsPool.push(pendingStats);
            }
            // Pending stats pool end
            var pendingStats = [];
            function pushScopeStats(start, end, stats) {
                var ps = allocPendingStats();
                ps.startQueryIndex = start;
                ps.endQueryIndex = end;
                ps.sum = 0;
                ps.stats = stats;
                pendingStats.push(ps);
            }
            // we should call this at the beginning of the frame,
            // in order to update gpuTime
            var timeSum = [];
            var queryPtr = [];
            function update() {
                var ptr, i;
                var n = pendingQueries.length;
                if (n === 0) {
                    return;
                }
                // Reserve space
                queryPtr.length = Math.max(queryPtr.length, n + 1);
                timeSum.length = Math.max(timeSum.length, n + 1);
                timeSum[0] = 0;
                queryPtr[0] = 0;
                // Update all pending timer queries
                var queryTime = 0;
                ptr = 0;
                for (i = 0; i < pendingQueries.length; ++i) {
                    var query = pendingQueries[i];
                    if (extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_AVAILABLE_EXT)) {
                        queryTime += extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_EXT);
                        freeQuery(query);
                    }
                    else {
                        pendingQueries[ptr++] = query;
                    }
                    timeSum[i + 1] = queryTime;
                    queryPtr[i + 1] = ptr;
                }
                pendingQueries.length = ptr;
                // Update all pending stat queries
                ptr = 0;
                for (i = 0; i < pendingStats.length; ++i) {
                    var stats = pendingStats[i];
                    var start = stats.startQueryIndex;
                    var end = stats.endQueryIndex;
                    stats.sum += timeSum[end] - timeSum[start];
                    var startPtr = queryPtr[start];
                    var endPtr = queryPtr[end];
                    if (endPtr === startPtr) {
                        stats.stats.gpuTime += stats.sum / 1e6;
                        freePendingStats(stats);
                    }
                    else {
                        stats.startQueryIndex = startPtr;
                        stats.endQueryIndex = endPtr;
                        pendingStats[ptr++] = stats;
                    }
                }
                pendingStats.length = ptr;
            }
            return {
                beginQuery: beginQuery,
                endQuery: endQuery,
                pushScopeStats: pushScopeStats,
                update: update,
                getNumPendingQueries: function () {
                    return pendingQueries.length;
                },
                clear: function () {
                    queryPool.push.apply(queryPool, pendingQueries);
                    for (var i = 0; i < queryPool.length; i++) {
                        extensions.ext_disjoint_timer_query.deleteQueryEXT(queryPool[i]);
                    }
                    pendingQueries.length = 0;
                    queryPool.length = 0;
                },
                restore: function () {
                    pendingQueries.length = 0;
                    queryPool.length = 0;
                }
            };
        };
        var GL_COLOR_BUFFER_BIT = 16384;
        var GL_DEPTH_BUFFER_BIT = 256;
        var GL_STENCIL_BUFFER_BIT = 1024;
        var GL_ARRAY_BUFFER = 34962;
        var CONTEXT_LOST_EVENT = 'webglcontextlost';
        var CONTEXT_RESTORED_EVENT = 'webglcontextrestored';
        var DYN_PROP = 1;
        var DYN_CONTEXT = 2;
        var DYN_STATE = 3;
        function find(haystack, needle) {
            for (var i = 0; i < haystack.length; ++i) {
                if (haystack[i] === needle) {
                    return i;
                }
            }
            return -1;
        }
        function wrapREGL(args) {
            var config = parseArgs(args);
            if (!config) {
                return null;
            }
            var gl = config.gl;
            var glAttributes = gl.getContextAttributes();
            var contextLost = gl.isContextLost();
            var extensionState = createExtensionCache(gl, config);
            if (!extensionState) {
                return null;
            }
            var stringStore = createStringStore();
            var stats$$1 = stats();
            var extensions = extensionState.extensions;
            var timer = createTimer(gl, extensions);
            var START_TIME = clock();
            var WIDTH = gl.drawingBufferWidth;
            var HEIGHT = gl.drawingBufferHeight;
            var contextState = {
                tick: 0,
                time: 0,
                viewportWidth: WIDTH,
                viewportHeight: HEIGHT,
                framebufferWidth: WIDTH,
                framebufferHeight: HEIGHT,
                drawingBufferWidth: WIDTH,
                drawingBufferHeight: HEIGHT,
                pixelRatio: config.pixelRatio
            };
            var uniformState = {};
            var drawState = {
                elements: null,
                primitive: 4,
                count: -1,
                offset: 0,
                instances: -1
            };
            var limits = wrapLimits(gl, extensions);
            var bufferState = wrapBufferState(gl, stats$$1, config, destroyBuffer);
            var elementState = wrapElementsState(gl, extensions, bufferState, stats$$1);
            var attributeState = wrapAttributeState(gl, extensions, limits, stats$$1, bufferState, elementState, drawState);
            function destroyBuffer(buffer) {
                return attributeState.destroyBuffer(buffer);
            }
            var shaderState = wrapShaderState(gl, stringStore, stats$$1, config);
            var textureState = createTextureSet(gl, extensions, limits, function () { core.procs.poll(); }, contextState, stats$$1, config);
            var renderbufferState = wrapRenderbuffers(gl, extensions, limits, stats$$1, config);
            var framebufferState = wrapFBOState(gl, extensions, limits, textureState, renderbufferState, stats$$1);
            var core = reglCore(gl, stringStore, extensions, limits, bufferState, elementState, textureState, framebufferState, uniformState, attributeState, shaderState, drawState, contextState, timer, config);
            var readPixels = wrapReadPixels(gl, framebufferState, core.procs.poll, contextState, glAttributes, extensions, limits);
            var nextState = core.next;
            var canvas = gl.canvas;
            var rafCallbacks = [];
            var lossCallbacks = [];
            var restoreCallbacks = [];
            var destroyCallbacks = [config.onDestroy];
            var activeRAF = null;
            function handleRAF() {
                if (rafCallbacks.length === 0) {
                    if (timer) {
                        timer.update();
                    }
                    activeRAF = null;
                    return;
                }
                // schedule next animation frame
                activeRAF = raf.next(handleRAF);
                // poll for changes
                poll();
                // fire a callback for all pending rafs
                for (var i = rafCallbacks.length - 1; i >= 0; --i) {
                    var cb = rafCallbacks[i];
                    if (cb) {
                        cb(contextState, null, 0);
                    }
                }
                // flush all pending webgl calls
                gl.flush();
                // poll GPU timers *after* gl.flush so we don't delay command dispatch
                if (timer) {
                    timer.update();
                }
            }
            function startRAF() {
                if (!activeRAF && rafCallbacks.length > 0) {
                    activeRAF = raf.next(handleRAF);
                }
            }
            function stopRAF() {
                if (activeRAF) {
                    raf.cancel(handleRAF);
                    activeRAF = null;
                }
            }
            function handleContextLoss(event) {
                event.preventDefault();
                // set context lost flag
                contextLost = true;
                // pause request animation frame
                stopRAF();
                // lose context
                lossCallbacks.forEach(function (cb) {
                    cb();
                });
            }
            function handleContextRestored(event) {
                // clear error code
                gl.getError();
                // clear context lost flag
                contextLost = false;
                // refresh state
                extensionState.restore();
                shaderState.restore();
                bufferState.restore();
                textureState.restore();
                renderbufferState.restore();
                framebufferState.restore();
                attributeState.restore();
                if (timer) {
                    timer.restore();
                }
                // refresh state
                core.procs.refresh();
                // restart RAF
                startRAF();
                // restore context
                restoreCallbacks.forEach(function (cb) {
                    cb();
                });
            }
            if (canvas) {
                canvas.addEventListener(CONTEXT_LOST_EVENT, handleContextLoss, false);
                canvas.addEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored, false);
            }
            function destroy() {
                rafCallbacks.length = 0;
                stopRAF();
                if (canvas) {
                    canvas.removeEventListener(CONTEXT_LOST_EVENT, handleContextLoss);
                    canvas.removeEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored);
                }
                shaderState.clear();
                framebufferState.clear();
                renderbufferState.clear();
                attributeState.clear();
                textureState.clear();
                elementState.clear();
                bufferState.clear();
                if (timer) {
                    timer.clear();
                }
                destroyCallbacks.forEach(function (cb) {
                    cb();
                });
            }
            function compileProcedure(options) {
                check$1(!!options, 'invalid args to regl({...})');
                check$1.type(options, 'object', 'invalid args to regl({...})');
                function flattenNestedOptions(options) {
                    var result = extend({}, options);
                    delete result.uniforms;
                    delete result.attributes;
                    delete result.context;
                    delete result.vao;
                    if ('stencil' in result && result.stencil.op) {
                        result.stencil.opBack = result.stencil.opFront = result.stencil.op;
                        delete result.stencil.op;
                    }
                    function merge(name) {
                        if (name in result) {
                            var child = result[name];
                            delete result[name];
                            Object.keys(child).forEach(function (prop) {
                                result[name + '.' + prop] = child[prop];
                            });
                        }
                    }
                    merge('blend');
                    merge('depth');
                    merge('cull');
                    merge('stencil');
                    merge('polygonOffset');
                    merge('scissor');
                    merge('sample');
                    if ('vao' in options) {
                        result.vao = options.vao;
                    }
                    return result;
                }
                function separateDynamic(object, useArrays) {
                    var staticItems = {};
                    var dynamicItems = {};
                    Object.keys(object).forEach(function (option) {
                        var value = object[option];
                        if (dynamic.isDynamic(value)) {
                            dynamicItems[option] = dynamic.unbox(value, option);
                            return;
                        }
                        else if (useArrays && Array.isArray(value)) {
                            for (var i = 0; i < value.length; ++i) {
                                if (dynamic.isDynamic(value[i])) {
                                    dynamicItems[option] = dynamic.unbox(value, option);
                                    return;
                                }
                            }
                        }
                        staticItems[option] = value;
                    });
                    return {
                        dynamic: dynamicItems,
                        static: staticItems
                    };
                }
                // Treat context variables separate from other dynamic variables
                var context = separateDynamic(options.context || {}, true);
                var uniforms = separateDynamic(options.uniforms || {}, true);
                var attributes = separateDynamic(options.attributes || {}, false);
                var opts = separateDynamic(flattenNestedOptions(options), false);
                var stats$$1 = {
                    gpuTime: 0.0,
                    cpuTime: 0.0,
                    count: 0
                };
                var compiled = core.compile(opts, attributes, uniforms, context, stats$$1);
                var draw = compiled.draw;
                var batch = compiled.batch;
                var scope = compiled.scope;
                // FIXME: we should modify code generation for batch commands so this
                // isn't necessary
                var EMPTY_ARRAY = [];
                function reserve(count) {
                    while (EMPTY_ARRAY.length < count) {
                        EMPTY_ARRAY.push(null);
                    }
                    return EMPTY_ARRAY;
                }
                function REGLCommand(args, body) {
                    var i;
                    if (contextLost) {
                        check$1.raise('context lost');
                    }
                    if (typeof args === 'function') {
                        return scope.call(this, null, args, 0);
                    }
                    else if (typeof body === 'function') {
                        if (typeof args === 'number') {
                            for (i = 0; i < args; ++i) {
                                scope.call(this, null, body, i);
                            }
                        }
                        else if (Array.isArray(args)) {
                            for (i = 0; i < args.length; ++i) {
                                scope.call(this, args[i], body, i);
                            }
                        }
                        else {
                            return scope.call(this, args, body, 0);
                        }
                    }
                    else if (typeof args === 'number') {
                        if (args > 0) {
                            return batch.call(this, reserve(args | 0), args | 0);
                        }
                    }
                    else if (Array.isArray(args)) {
                        if (args.length) {
                            return batch.call(this, args, args.length);
                        }
                    }
                    else {
                        return draw.call(this, args);
                    }
                }
                return extend(REGLCommand, {
                    stats: stats$$1,
                    destroy: function () {
                        compiled.destroy();
                    }
                });
            }
            var setFBO = framebufferState.setFBO = compileProcedure({
                framebuffer: dynamic.define.call(null, DYN_PROP, 'framebuffer')
            });
            function clearImpl(_, options) {
                var clearFlags = 0;
                core.procs.poll();
                var c = options.color;
                if (c) {
                    gl.clearColor(+c[0] || 0, +c[1] || 0, +c[2] || 0, +c[3] || 0);
                    clearFlags |= GL_COLOR_BUFFER_BIT;
                }
                if ('depth' in options) {
                    gl.clearDepth(+options.depth);
                    clearFlags |= GL_DEPTH_BUFFER_BIT;
                }
                if ('stencil' in options) {
                    gl.clearStencil(options.stencil | 0);
                    clearFlags |= GL_STENCIL_BUFFER_BIT;
                }
                check$1(!!clearFlags, 'called regl.clear with no buffer specified');
                gl.clear(clearFlags);
            }
            function clear(options) {
                check$1(typeof options === 'object' && options, 'regl.clear() takes an object as input');
                if ('framebuffer' in options) {
                    if (options.framebuffer &&
                        options.framebuffer_reglType === 'framebufferCube') {
                        for (var i = 0; i < 6; ++i) {
                            setFBO(extend({
                                framebuffer: options.framebuffer.faces[i]
                            }, options), clearImpl);
                        }
                    }
                    else {
                        setFBO(options, clearImpl);
                    }
                }
                else {
                    clearImpl(null, options);
                }
            }
            function frame(cb) {
                check$1.type(cb, 'function', 'regl.frame() callback must be a function');
                rafCallbacks.push(cb);
                function cancel() {
                    // FIXME:  should we check something other than equals cb here?
                    // what if a user calls frame twice with the same callback...
                    //
                    var i = find(rafCallbacks, cb);
                    check$1(i >= 0, 'cannot cancel a frame twice');
                    function pendingCancel() {
                        var index = find(rafCallbacks, pendingCancel);
                        rafCallbacks[index] = rafCallbacks[rafCallbacks.length - 1];
                        rafCallbacks.length -= 1;
                        if (rafCallbacks.length <= 0) {
                            stopRAF();
                        }
                    }
                    rafCallbacks[i] = pendingCancel;
                }
                startRAF();
                return {
                    cancel: cancel
                };
            }
            // poll viewport
            function pollViewport() {
                var viewport = nextState.viewport;
                var scissorBox = nextState.scissor_box;
                viewport[0] = viewport[1] = scissorBox[0] = scissorBox[1] = 0;
                contextState.viewportWidth =
                    contextState.framebufferWidth =
                        contextState.drawingBufferWidth =
                            viewport[2] =
                                scissorBox[2] = gl.drawingBufferWidth;
                contextState.viewportHeight =
                    contextState.framebufferHeight =
                        contextState.drawingBufferHeight =
                            viewport[3] =
                                scissorBox[3] = gl.drawingBufferHeight;
            }
            function poll() {
                contextState.tick += 1;
                contextState.time = now();
                pollViewport();
                core.procs.poll();
            }
            function refresh() {
                textureState.refresh();
                pollViewport();
                core.procs.refresh();
                if (timer) {
                    timer.update();
                }
            }
            function now() {
                return (clock() - START_TIME) / 1000.0;
            }
            refresh();
            function addListener(event, callback) {
                check$1.type(callback, 'function', 'listener callback must be a function');
                var callbacks;
                switch (event) {
                    case 'frame':
                        return frame(callback);
                    case 'lost':
                        callbacks = lossCallbacks;
                        break;
                    case 'restore':
                        callbacks = restoreCallbacks;
                        break;
                    case 'destroy':
                        callbacks = destroyCallbacks;
                        break;
                    default:
                        check$1.raise('invalid event, must be one of frame,lost,restore,destroy');
                }
                callbacks.push(callback);
                return {
                    cancel: function () {
                        for (var i = 0; i < callbacks.length; ++i) {
                            if (callbacks[i] === callback) {
                                callbacks[i] = callbacks[callbacks.length - 1];
                                callbacks.pop();
                                return;
                            }
                        }
                    }
                };
            }
            var regl = extend(compileProcedure, {
                // Clear current FBO
                clear: clear,
                // Short cuts for dynamic variables
                prop: dynamic.define.bind(null, DYN_PROP),
                context: dynamic.define.bind(null, DYN_CONTEXT),
                this: dynamic.define.bind(null, DYN_STATE),
                // executes an empty draw command
                draw: compileProcedure({}),
                // Resources
                buffer: function (options) {
                    return bufferState.create(options, GL_ARRAY_BUFFER, false, false);
                },
                elements: function (options) {
                    return elementState.create(options, false);
                },
                texture: textureState.create2D,
                cube: textureState.createCube,
                renderbuffer: renderbufferState.create,
                framebuffer: framebufferState.create,
                framebufferCube: framebufferState.createCube,
                vao: attributeState.createVAO,
                // Expose context attributes
                attributes: glAttributes,
                // Frame rendering
                frame: frame,
                on: addListener,
                // System limits
                limits: limits,
                hasExtension: function (name) {
                    return limits.extensions.indexOf(name.toLowerCase()) >= 0;
                },
                // Read pixels
                read: readPixels,
                // Destroy regl and all associated resources
                destroy: destroy,
                // Direct GL state manipulation
                _gl: gl,
                _refresh: refresh,
                poll: function () {
                    poll();
                    if (timer) {
                        timer.update();
                    }
                },
                // Current time
                now: now,
                // regl Statistics Information
                stats: stats$$1
            });
            config.onDone(null, regl);
            return regl;
        }
        return wrapREGL;
    })));
},
528: /* models/glyphs/webgl/dash_cache.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var tslib_1 = require(1) /* tslib */;
    var math_1 = require(529) /* ./utils/math */;
    var arrayable_1 = require(116) /* ../../../core/util/arrayable */;
    /*
     * DashCache creates and stores webgl resources for dashes that can be reused
     * for different webgl lines.  Dash represented by pattern which is a list of
     * an even number of integers.
     */
    var DashCache = /** @class */ (function () {
        function DashCache(regl) {
            this._regl = regl;
            this._map = new Map();
        }
        DashCache.prototype._create_texture = function (pattern) {
            /*
             * Texture used to represent dash pattern is a distance function.  Each tex
             * value is the distance to the nearest edge between a dash and a gap; +ve
             * if in a dash and -ve if in a gap.  If this was an analytical function
             * then it would be piecewise linear with turning points (local extremes)
             * in the middle of each dash and each gap.  Try to use the minimum texture
             * length that includes all these middle points.  For a single dash (hence
             * single gap) this is 2 values, one each in the middle of the dash and the
             * gap.
             * For rendering the texture is repeated.  WebGL only supports this for
             * texture lengths that are a power of 2, so if the ideal texture length is
             * not a power of 2 then increase it to be a large power of 2 and do not
             * bother to ensure that turning points in the distance function correspond
             * to texture value locations.
             * Finally, would like to use floating point textures for the distance.
             * However, these are often not available on mobile devices so instead scale
             * them to uint8 and convert back to floating point in fragment shader.
             */
            var n = pattern.length; // Number of items in pattern.
            var len = 0; // Length of pattern.
            var twice_jumps = []; // Twice the jumps between dash middles.
            var dist_min = 0.0, dist_max = 0.0; // Min and max distances.
            for (var i = 0; i < n; i++) {
                len += pattern[i];
                twice_jumps.push(pattern[i] + pattern[(i + 1) % n]);
                if (i % 2 == 0)
                    dist_max = Math.max(dist_max, pattern[i]); // Dash.
                else
                    dist_min = Math.min(dist_min, -pattern[i]); // Gap.
            }
            dist_min *= 0.5;
            dist_max *= 0.5;
            var twice_jumps_gcd = (0, math_1.gcd)(twice_jumps);
            // Starts and ends of dashes and gaps.
            var starts_and_ends = [0];
            for (var i = 0; i < n; i++)
                starts_and_ends.push(starts_and_ends[i] + pattern[i]);
            // Length of texture, webgl requires a power of 2.
            var ideal_ntex = 2 * len / twice_jumps_gcd;
            var length_pow_2 = (0, math_1.is_pow_2)(ideal_ntex);
            var ntex = length_pow_2 ? ideal_ntex : 128;
            // Distance between texture values.
            var dtex = 0.5 * twice_jumps_gcd * ideal_ntex / ntex;
            // xstart is the position along the texture of the first value, and offset
            // is the distance to the upstroke of the first dash.
            // When interpolating the texture each texel fills 1/ntex of the length of
            // the texture.  For a single dash the centre of the dash is 0.25 along
            // the texture, so the upstroke offset has to be determined from this.
            var xstart;
            if (length_pow_2) {
                xstart = 0.5 * pattern[0];
                if (dtex < xstart) {
                    var n_dtex = Math.floor(xstart / dtex);
                    xstart -= n_dtex * dtex;
                }
            }
            else {
                // Have lots of values so don't need to match middles of dashes/gaps.
                xstart = 0.0;
            }
            var offset = xstart - 0.5 * dtex;
            // Calculate values for texture.
            var dist = new Uint8Array(ntex);
            var dash_index = 0;
            for (var i = 0; i < ntex; i++) {
                var x = xstart + i * dtex; // Distance along texture.
                // Which dash are we in?
                if (x > starts_and_ends[dash_index + 1])
                    dash_index++;
                var xsize = pattern[dash_index];
                var xmid = starts_and_ends[dash_index] + 0.5 * xsize;
                var dist_float = 0.5 * xsize - Math.abs(x - xmid);
                if (dash_index % 2 == 1)
                    dist_float = -dist_float; // Change sign for gaps between dashes.
                dist[i] = Math.round(255 * (dist_float - dist_min) / (dist_max - dist_min));
            }
            // Create the 1D texture.
            var tex = this._regl.texture({
                shape: [ntex, 1, 1],
                data: dist,
                wrapS: "repeat",
                format: "alpha",
                type: "uint8",
                mag: "linear",
                min: "linear",
            });
            return [[len, offset, dist_min, dist_max], tex];
        };
        DashCache.prototype._get_key = function (pattern) {
            return pattern.join(",");
        };
        DashCache.prototype._get_or_create = function (pattern) {
            var key = this._get_key(pattern);
            var cached = this._map.get(key);
            if (cached == null) {
                var scale_1 = (0, math_1.gcd)(pattern);
                if (scale_1 > 1) {
                    // Do not modify pattern in-place, create a new one.
                    pattern = (0, arrayable_1.map)(pattern, function (n) { return (n / scale_1); });
                    // Get the simple pattern that can be reused when scaled up.
                    cached = this._get_or_create(pattern);
                    // Store an entry for the requested pattern which is just the simple
                    // pattern scaled-up.
                    var _a = (0, tslib_1.__read)(cached, 3), tex_info = _a[0], tex = _a[1], _simple_scale = _a[2];
                    cached = [tex_info, tex, scale_1];
                    this._map.set(key, cached);
                }
                else {
                    // Simple pattern with scale of 1.
                    var _b = (0, tslib_1.__read)(this._create_texture(pattern), 2), tex_info = _b[0], tex = _b[1];
                    // Store the simple pattern.
                    cached = [tex_info, tex, scale_1];
                    this._map.set(key, cached);
                }
            }
            return cached;
        };
        DashCache.prototype.get = function (pattern) {
            // Limit pattern to even number of items.
            if (pattern.length % 2 == 1)
                pattern = pattern.slice(0, -1);
            return this._get_or_create(pattern);
        };
        return DashCache;
    }());
    exports.DashCache = DashCache;
    DashCache.__name__ = "DashCache";
},
529: /* models/glyphs/webgl/utils/math.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    // Greatest Common Divisor of 2+ integers using Euclid's algorithm.
    function gcd2(a, b) {
        var higher;
        var lower;
        if (a > b) {
            higher = a;
            lower = b;
        }
        else {
            higher = b;
            lower = a;
        }
        var divisor = higher % lower;
        while (divisor != 0) {
            higher = lower;
            lower = divisor;
            divisor = higher % lower;
        }
        return lower;
    }
    function gcd(values) {
        var ret = values[0];
        for (var i = 1; i < values.length; i++)
            ret = gcd2(ret, values[i]);
        return ret;
    }
    exports.gcd = gcd;
    // From regl
    function is_pow_2(v) {
        return !(v & (v - 1)) && (!!v);
    }
    exports.is_pow_2 = is_pow_2;
},
530: /* models/glyphs/webgl/regl_line.vert.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var shader = "\nprecision mediump float;\n\nconst int butt_cap   = 0;\nconst int round_cap  = 1;\nconst int square_cap = 2;\n\nconst int miter_join = 0;\nconst int round_join = 1;\nconst int bevel_join = 2;\n\nconst float missing_point_threshold = -9000.0;\n\nattribute vec2 a_position;\nattribute vec2 a_point_prev;\nattribute vec2 a_point_start;\nattribute vec2 a_point_end;\nattribute vec2 a_point_next;\n#ifdef DASHED\nattribute float a_length_so_far;\n#endif\n\nuniform float u_pixel_ratio;\nuniform vec2 u_canvas_size;\nuniform float u_linewidth;\nuniform float u_antialias;\nuniform float u_line_join;\nuniform float u_line_cap;\nuniform float u_miter_limit;\n\nvarying float v_segment_length;\nvarying vec2 v_coords;\nvarying float v_flags;  // Booleans for start/end caps and miters too long.\nvarying float v_cos_theta_turn_right_start;  // Sign gives turn_right, abs gives\nvarying float v_cos_theta_turn_right_end;    //   cos(theta).\n#ifdef DASHED\nvarying float v_length_so_far;\n#endif\n\nfloat cross_z(in vec2 v0, in vec2 v1)\n{\n    return v0.x*v1.y - v0.y*v1.x;\n}\n\nvec2 right_vector(in vec2 v)\n{\n    return vec2(v.y, -v.x);\n}\n\nvec2 line_intersection(in vec2 point0, in vec2 dir0,\n                       in vec2 point1, in vec2 dir1)\n{\n    // Line-line intersection: point0 + lambda0 dir0 = point1 + lambda1 dir1.\n    // Not checking if lines are parallel!\n    float lambda0 = cross_z(point1 - point0, dir1) / cross_z(dir0, dir1);\n    return point0 + lambda0*dir0;\n}\n\nvoid main()\n{\n    if (a_point_start.x < missing_point_threshold ||\n        a_point_end.x < missing_point_threshold) {\n        // Line segment has non-finite value at one or both ends, do not render.\n        gl_Position = vec4(-2.0, -2.0, 0.0, 1.0);\n        return;\n    }\n\n    const float min_miter_factor_round_join_mesh = sqrt(2.0);\n\n    int join_type = int(u_line_join + 0.5);\n    int cap_type = int(u_line_cap + 0.5);\n    float halfwidth = 0.5*(u_linewidth + u_antialias);\n    vec2 segment_along = normalize(a_point_end - a_point_start); // unit vector.\n    v_segment_length = length(a_point_end - a_point_start);\n    vec2 segment_right = right_vector(segment_along);  // unit vector.\n    vec2 xy;\n\n    bool miter_too_large_start = false;\n    bool miter_too_large_end = false;\n\n    v_coords.y = a_position.y*halfwidth;  // Overwritten later for end points.\n\n    bool has_start_cap = a_point_prev.x < missing_point_threshold;\n    bool has_end_cap = a_point_next.x < missing_point_threshold;\n\n    vec2 point_normal_start;\n    float cos_theta_start;\n    float turn_right_start;\n    if (has_start_cap)\n        point_normal_start = segment_right;\n    else {\n        vec2 prev_right = right_vector(normalize(a_point_start - a_point_prev));\n        point_normal_start = normalize(segment_right + prev_right);\n        cos_theta_start = dot(segment_right, point_normal_start);  // Always +ve\n        turn_right_start = sign(dot(segment_right, a_point_prev - a_point_start));\n    }\n\n    vec2 point_normal_end;\n    float cos_theta_end;\n    float turn_right_end;\n    if (has_end_cap)\n        point_normal_end = segment_right;\n    else {\n        vec2 next_right = right_vector(normalize(a_point_next - a_point_end));\n        point_normal_end = normalize(segment_right + next_right);\n        cos_theta_end = dot(segment_right, point_normal_end);  // Always +ve\n        turn_right_end = sign(dot(segment_right, a_point_next - a_point_end));\n    }\n\n    float miter_factor_start = 1.0 / dot(segment_right, point_normal_start);\n    float miter_factor_end = 1.0 / dot(segment_right, point_normal_end);\n    if (join_type == miter_join) {\n        // If miter too large, use bevel join instead.\n        miter_too_large_start = (miter_factor_start > u_miter_limit);\n        miter_too_large_end = (miter_factor_end > u_miter_limit);\n    }\n\n    float sign_at_start = -sign(a_position.x);  // +ve at segment start, -ve end.\n    vec2 point = sign_at_start > 0.0 ? a_point_start : a_point_end;\n    vec2 adjacent_point =\n        sign_at_start > 0.0 ? (has_start_cap ? a_point_start : a_point_prev)\n                            : (has_end_cap ? a_point_end : a_point_next);\n\n    if ( (has_start_cap && sign_at_start > 0.0) ||\n         (has_end_cap && sign_at_start < 0.0) ) {\n        // Cap.\n        xy = point - segment_right*(halfwidth*a_position.y);\n        if (cap_type == butt_cap)\n            xy -= sign_at_start*0.5*u_antialias*segment_along;\n        else\n            xy -= sign_at_start*halfwidth*segment_along;\n    }\n    else { // Join.\n        // +ve if turning to right, -ve if to left.\n        float turn_sign = sign_at_start > 0.0 ? turn_right_start : turn_right_end;\n\n        vec2 adjacent_right = sign_at_start*normalize(right_vector(point - adjacent_point));\n        vec2 point_right = normalize(segment_right + adjacent_right);\n        float miter_factor = sign_at_start > 0.0 ? miter_factor_start : miter_factor_end;\n        bool miter_too_large = sign_at_start > 0.0 ? miter_too_large_start : miter_too_large_end;\n\n        if (abs(a_position.x) > 1.5) {\n            // Outer point, meets prev/next segment.\n            float factor;  // multiplied by halfwidth...\n\n            if (join_type == bevel_join || (join_type == miter_join && miter_too_large))\n                factor = 1.0 / miter_factor;  // cos_theta.\n            else if (join_type == round_join &&\n                     miter_factor > min_miter_factor_round_join_mesh)\n                factor = 1.0;\n            else  // miter, or round (small angle only).\n                factor = miter_factor;\n\n            xy = point - point_right*(halfwidth*turn_sign*factor);\n            v_coords.y = turn_sign*halfwidth*factor / miter_factor;\n        }\n        else if (turn_sign*a_position.y < 0.0) {\n            // Inner point, meets prev/next segment.\n            float len = halfwidth*miter_factor;\n            float segment_len = v_segment_length;\n            float adjacent_len = distance(point, adjacent_point);\n\n            if (len <= min(segment_len, adjacent_len))\n                // Normal behaviour.\n                xy = point - point_right*(len*a_position.y);\n            else\n                // For short wide line segments the inner point using the above\n                // calculation can be outside of the line.  Here clipping it.\n                xy = point + segment_right*(halfwidth*turn_sign);\n        }\n        else {\n            // Point along outside edge.\n            xy = point - segment_right*(halfwidth*a_position.y);\n            if (join_type == round_join &&\n                miter_factor > min_miter_factor_round_join_mesh) {\n                xy = line_intersection(xy, segment_along,\n                                       point - turn_sign*point_right*halfwidth,\n                                       right_vector(point_right));\n            }\n        }\n    }\n\n    vec2 pos = xy + 0.5;  // Bokeh's offset.\n    pos /= u_canvas_size / u_pixel_ratio;  // in 0..1\n    gl_Position = vec4(2.0*pos.x - 1.0, 1.0 - 2.0*pos.y, 0.0, 1.0);\n\n    v_coords.x = dot(xy - a_point_start, segment_along);\n    v_flags = float(int(has_start_cap) +\n                    2*int(has_end_cap) +\n                    4*int(miter_too_large_start) +\n                    8*int(miter_too_large_end));\n    v_cos_theta_turn_right_start = cos_theta_start*turn_right_start;\n    v_cos_theta_turn_right_end = cos_theta_end*turn_right_end;\n\n#ifdef DASHED\n    v_length_so_far = a_length_so_far;\n#endif\n}\n";
    exports.default = shader;
},
531: /* models/glyphs/webgl/regl_line.frag.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var shader = "\nprecision mediump float;\n\nconst int butt_cap   = 0;\nconst int round_cap  = 1;\nconst int square_cap = 2;\n\nconst int miter_join = 0;\nconst int round_join = 1;\nconst int bevel_join = 2;\n\nuniform float u_linewidth;\nuniform float u_antialias;\nuniform float u_line_join;\nuniform float u_line_cap;\nuniform vec4 u_line_color;\n#ifdef DASHED\nuniform sampler2D u_dash_tex;\nuniform vec4 u_dash_tex_info;\nuniform float u_dash_scale;\nuniform float u_dash_offset;\n#endif\n\nvarying float v_segment_length;\nvarying vec2 v_coords;\nvarying float v_flags;\nvarying float v_cos_theta_turn_right_start;\nvarying float v_cos_theta_turn_right_end;\n#ifdef DASHED\nvarying float v_length_so_far;\n#endif\n\nfloat cross_z(in vec2 v0, in vec2 v1)\n{\n    return v0.x*v1.y - v0.y*v1.x;\n}\n\nfloat point_line_side(in vec2 point, in vec2 start, in vec2 end)\n{\n    // +ve if point to right of line.\n    // Alternatively could do dot product with right_vector.\n    return cross_z(point - start, end - start);\n}\n\nfloat point_line_distance(in vec2 point, in vec2 start, in vec2 end)\n{\n    return point_line_side(point, start, end) / distance(start, end);\n}\n\nvec2 right_vector(in vec2 v)\n{\n    return vec2(v.y, -v.x);\n}\n\nfloat bevel_join_distance(in float sign_start, in float halfwidth)\n{\n    float cos_theta_turn_right = sign_start > 0.0 ? v_cos_theta_turn_right_start\n                                                  : v_cos_theta_turn_right_end;\n    float cos_theta = abs(cos_theta_turn_right);\n    float turn_right = sign(cos_theta_turn_right);\n    float distance_along = sign_start > 0.0 ? 0.0 : v_segment_length;\n\n    // In v_coords reference frame (x is along segment, y across).\n    vec2 line_start = vec2(distance_along, halfwidth*turn_right);\n    float sin_alpha = cos_theta;\n    float cos_alpha = sqrt(1.0 - sin_alpha*sin_alpha);\n    vec2 line_along = vec2(-sign_start*turn_right*sin_alpha, -cos_alpha);\n\n    return halfwidth + sign_start*point_line_distance(\n        v_coords, line_start, line_start+line_along);\n}\n\nfloat cap(in int cap_type, in float x, in float y)\n{\n    // x is distance along segment in direction away from end of segment,\n    // y is distance across segment.\n    if (cap_type == butt_cap)\n        return max(0.5*u_linewidth - x, abs(y));\n    else if (cap_type == square_cap)\n        return max(-x, abs(y));\n    else  // cap_type == round_cap\n        return distance(vec2(min(x, 0.0), y), vec2(0.0, 0.0));\n}\n\nfloat distance_to_alpha(in float dist)\n{\n    return 1.0 - smoothstep(0.5*(u_linewidth - u_antialias),\n                            0.5*(u_linewidth + u_antialias), dist);\n}\n\n#ifdef DASHED\nfloat dash_distance(in float x)\n{\n    // x is in direction of v_coords.x, i.e. along segment.\n    float tex_length = u_dash_tex_info.x;\n    float tex_offset = u_dash_tex_info.y;\n    float tex_dist_min = u_dash_tex_info.z;\n    float tex_dist_max = u_dash_tex_info.w;\n\n    // Apply offset.\n    x += v_length_so_far - u_dash_scale*tex_offset + u_dash_offset;\n\n    // Interpolate within texture to obtain distance to dash.\n    float dist = texture2D(u_dash_tex,\n                           vec2(x / (tex_length*u_dash_scale), 0.0)).a;\n\n    // Scale distance within min and max limits.\n    dist = tex_dist_min + dist*(tex_dist_max - tex_dist_min);\n\n    return u_dash_scale*dist;\n}\n\nmat2 rotation_matrix(in float sign_start)\n{\n    // Rotation matrix for v_coords from this segment to prev or next segment.\n    float cos_theta_turn_right = sign_start > 0.0 ? v_cos_theta_turn_right_start\n                                                  : v_cos_theta_turn_right_end;\n    float cos_theta = abs(cos_theta_turn_right);\n    float turn_right = sign(cos_theta_turn_right);\n\n    float sin_theta = sqrt(1.0 - cos_theta*cos_theta)*sign_start*turn_right;\n    float cos_2theta = 2.0*cos_theta*cos_theta - 1.0;\n    float sin_2theta = 2.0*sin_theta*cos_theta;\n    return mat2(cos_2theta, -sin_2theta, sin_2theta, cos_2theta);\n}\n#endif\n\nvoid main()\n{\n    int join_type = int(u_line_join + 0.5);\n    int cap_type = int(u_line_cap + 0.5);\n    float halfwidth = 0.5*(u_linewidth + u_antialias);\n\n    // Extract flags.\n    int flags = int(v_flags + 0.5);\n    bool miter_too_large_end = (flags / 8 > 0);\n    flags -= 8*int(miter_too_large_end);\n    bool miter_too_large_start = (flags / 4 > 0);\n    flags -= 4*int(miter_too_large_start);\n    bool has_end_cap = (flags / 2 > 0);\n    flags -= 2*int(has_end_cap);\n    bool has_start_cap = flags > 0;\n\n    float dist = v_coords.y;  // For straight segment, and miter join.\n\n    if (v_coords.x <= 0.5*u_antialias) {\n        // At start of segment, either cap or join.\n        if (has_start_cap)\n            dist = cap(cap_type, v_coords.x, v_coords.y);\n        else if (join_type == round_join)\n            dist = distance(v_coords, vec2(0.0, 0.0));\n        else if (join_type == bevel_join ||\n                 (join_type == miter_join && miter_too_large_start))\n            dist = max(abs(dist), bevel_join_distance(1.0, halfwidth));\n        // else a miter join which uses the default dist calculation.\n    }\n    else if (v_coords.x >= v_segment_length - 0.5*u_antialias) {\n        // At end of segment, either cap or join.\n        if (has_end_cap)\n            dist = cap(cap_type, v_segment_length - v_coords.x, v_coords.y);\n        else if (join_type == round_join)\n            dist = distance(v_coords, vec2(v_segment_length, 0));\n        else if ((join_type == bevel_join ||\n                 (join_type == miter_join && miter_too_large_end)))\n            dist = max(abs(dist), bevel_join_distance(-1.0, halfwidth));\n        // else a miter join which uses the default dist calculation.\n    }\n\n    float alpha = distance_to_alpha(abs(dist));\n\n#ifdef DASHED\n    if (u_dash_tex_info.x >= 0.0) {\n        // Dashes in straight segments (outside of joins) are easily calculated.\n        dist = dash_distance(v_coords.x);\n\n        if (!has_start_cap && cap_type == butt_cap) {\n            if (v_coords.x < 0.5*u_antialias) {\n                // Outer of start join rendered solid color or not at all\n                // depending on whether corner point is in dash or gap, with\n                // antialiased ends.\n                dist = (dash_distance(0.0) > 0.0 ? 0.5*u_antialias - v_coords.x\n                                                 : -0.5*u_linewidth);\n\n                // Also consider antialiased end of dash just outside corner.\n                float end_dist = dash_distance(0.5*u_antialias) + v_coords.x -\n                    0.5*u_antialias;\n                dist = max(dist, end_dist);\n            }\n\n            vec2 prev_coords = rotation_matrix(1.0)*v_coords;\n\n            if (abs(prev_coords.y) < halfwidth &&\n                prev_coords.x < 0.5*u_antialias) {\n                // Extend dashes across from previous segment, with antialiased\n                // end.\n                float new_dist = dash_distance(min(prev_coords.x,\n                                                   -0.5*u_antialias));\n\n                if (prev_coords.x > -0.5*u_antialias)\n                    new_dist -= prev_coords.x + 0.5*u_antialias;\n\n                new_dist = min(new_dist, 0.5*u_linewidth - abs(prev_coords.y));\n                dist = max(dist, new_dist);\n            }\n        }\n\n        if (!has_end_cap && cap_type == butt_cap) {\n            if (v_coords.x > v_segment_length - 0.5*u_antialias) {\n                // Similar for end join.\n                dist = (dash_distance(v_segment_length) > 0.0\n                            ? v_coords.x - v_segment_length + 0.5*u_antialias\n                            : -0.5*u_linewidth);\n\n                float end_dist =\n                    dash_distance(v_segment_length - 0.5*u_antialias) -\n                    v_coords.x + v_segment_length - 0.5*u_antialias;\n                dist = max(dist, end_dist);\n            }\n\n            vec2 next_coords =\n                rotation_matrix(-1.0)*(v_coords - vec2(v_segment_length, 0.0));\n\n            if (abs(next_coords.y) < halfwidth &&\n                next_coords.x > -0.5*u_antialias) {\n                // Extend dashes across from next segment, with antialiased end.\n                float new_dist = dash_distance(v_segment_length +\n                    max(next_coords.x, 0.5*u_antialias));\n\n                if (next_coords.x < 0.5*u_antialias)\n                    new_dist += next_coords.x - 0.5*u_antialias;\n\n                new_dist = min(new_dist, 0.5*u_linewidth - abs(next_coords.y));\n                dist = max(dist, new_dist);\n            }\n        }\n\n        dist = cap(cap_type, dist, v_coords.y);\n\n        float dash_alpha = distance_to_alpha(dist);\n        alpha = min(alpha, dash_alpha);\n    }\n#endif\n\n    alpha = u_line_color.a*alpha;\n    gl_FragColor = vec4(u_line_color.rgb*alpha, alpha);  // Premultiplied alpha.\n}\n";
    exports.default = shader;
},
532: /* models/glyphs/webgl/markers.vert.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var shader = "\nprecision mediump float;\n\nattribute vec2 a_position;\nattribute vec2 a_center;\nattribute float a_size;\nattribute float a_angle;  // in radians\nattribute float a_linewidth;\nattribute vec4 a_line_color;\nattribute vec4 a_fill_color;\nattribute float a_show;\n\nuniform float u_pixel_ratio;\nuniform vec2 u_canvas_size;\nuniform float u_antialias;\n\nvarying float v_linewidth;\nvarying float v_size;\nvarying vec4 v_line_color;\nvarying vec4 v_fill_color;\nvarying vec2 v_coords;\n\nvoid main()\n{\n    v_size = a_size;\n    v_linewidth = a_linewidth;\n    v_line_color = a_line_color;\n    v_fill_color = a_fill_color;\n\n    if (a_show < 0.5) {\n      // Do not show this marker.\n      gl_Position = vec4(-2.0, -2.0, 0.0, 1.0);\n      return;\n    }\n\n    float enclosing_size = v_size + 2.0*v_linewidth + 3.0*u_antialias;\n\n    // Coordinates in rotated frame with respect to center of marker, used in\n    // distance functions in fragment shader.\n    v_coords = a_position*enclosing_size;\n\n    float c = cos(-a_angle);\n    float s = sin(-a_angle);\n    mat2 rotation = mat2(c, -s, s, c);\n\n    vec2 pos = a_center + rotation*v_coords;\n    pos += 0.5;  // make up for Bokeh's offset\n    pos /= u_canvas_size / u_pixel_ratio;  // in 0..1\n    gl_Position = vec4(2.0*pos.x - 1.0, 1.0 - 2.0*pos.y, 0.0, 1.0);\n}\n";
    exports.default = shader;
},
533: /* models/glyphs/webgl/markers.frag.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var shader = "\nprecision mediump float;\n\nconst float SQRT_2 = 1.4142135623730951;\nconst float SQRT_3 = sqrt(3.0);\nconst float PI = 3.14159265358979323846264;\n\nconst float IN_ANGLE = 0.6283185307179586; // PI/5. = 36 degrees (star of 5 pikes)\n//const float OUT_ANGLE = PI/2. - IN_ANGLE; // External angle for regular stars\nconst float COS_A = 0.8090169943749475; // cos(IN_ANGLE)\nconst float SIN_A = 0.5877852522924731; // sin(IN_ANGLE)\nconst float COS_B = 0.5877852522924731; // cos(OUT_ANGLE)\nconst float SIN_B = 0.8090169943749475; // sin(OUT_ANGLE)\n\nuniform float u_antialias;\n\nvarying vec4 v_line_color;\nvarying vec4 v_fill_color;\nvarying float v_linewidth;\nvarying float v_size;\nvarying vec2 v_coords;\n\n#ifdef USE_ASTERISK\n// asterisk\nfloat marker(vec2 P, float size)\n{\n    // Masks\n    float diamond = max(abs(SQRT_2 / 2.0 * (P.x - P.y)), abs(SQRT_2 / 2.0 * (P.x + P.y))) - size / 2.0;\n    float square = max(abs(P.x), abs(P.y)) - size / 2.0;\n    // Shapes\n    float X = min(abs(P.x - P.y), abs(P.x + P.y));\n    float cross = min(abs(P.x), abs(P.y));\n    // Result is union of masked shapes\n    float result = min(max(X, diamond), max(cross, square));\n    return max(result - v_linewidth/2.0 + u_antialias/2.0, 0.0);\n}\n#endif\n\n#ifdef USE_CIRCLE\n// circle\nfloat marker(vec2 P, float size)\n{\n    return length(P) - size/2.0;\n}\n#endif\n\n#ifdef USE_DOT\nfloat marker(vec2 P, float size)\n{\n    return max(length(P) - size/8.0 - v_linewidth/15.0 + u_antialias, 0.0);\n}\n#endif\n\n#ifdef USE_CIRCLE_DOT\nfloat marker(vec2 P, float size)\n{\n    float circle = length(P) - size/2.0;\n    float dot_ = min(size/8.0 + v_linewidth/15.0 - u_antialias - length(P), 0.0);\n    return max(circle, dot_);\n}\n#endif\n\n#ifdef USE_SQUARE\n// square\nfloat marker(vec2 P, float size)\n{\n    return max(abs(P.x), abs(P.y)) - size/2.0;\n}\n#endif\n\n#ifdef USE_SQUARE_DOT\nfloat marker(vec2 P, float size)\n{\n    float square = max(abs(P.x), abs(P.y)) - size/2.0;\n    float dot_ = min(size/8.0 + v_linewidth/15.0 - u_antialias - length(P), 0.0);\n    return max(square, dot_);\n}\n#endif\n\n#ifdef USE_DIAMOND\n// diamond\nfloat marker(vec2 P, float size)\n{\n    float x = SQRT_2 / 2.0 * (P.x * 1.5 - P.y);\n    float y = SQRT_2 / 2.0 * (P.x * 1.5 + P.y);\n    float r1 = max(abs(x), abs(y)) - size / (2.0 * SQRT_2);\n    return r1 / SQRT_2;\n}\n#endif\n\n#ifdef USE_DIAMOND_DOT\nfloat marker(vec2 P, float size)\n{\n    float x = SQRT_2 / 2.0 * (P.x * 1.5 - P.y);\n    float y = SQRT_2 / 2.0 * (P.x * 1.5 + P.y);\n    float r1 = max(abs(x), abs(y)) - size / (2.0 * SQRT_2);\n    float diamond = r1 / SQRT_2;\n    float dot_ = min(size/8.0 + v_linewidth/15.0 - u_antialias - length(P), 0.0);\n    return max(diamond, dot_);\n}\n#endif\n\n#ifdef USE_HEX\n// hex\nfloat marker(vec2 P, float size)\n{\n    vec2 q = abs(P);\n    return max(q.y * 0.57735 + q.x - 1.0 * size/2.0, q.y - 0.866 * size/2.0);\n}\n#endif\n\n#ifdef USE_HEX_DOT\nfloat marker(vec2 P, float size)\n{\n    vec2 q = abs(P);\n    float hex = max(q.y * 0.57735 + q.x - 1.0 * size/2.0, q.y - 0.866 * size/2.0);\n    float dot_ = min(size/8.0 + v_linewidth/15.0 - u_antialias - length(P), 0.0);\n    return max(hex, dot_);\n}\n#endif\n\n#ifdef USE_STAR\n// star\n// https://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm\nfloat marker(vec2 P, float size)\n{\n    float bn = mod(atan(P.x, -P.y), 2.0*IN_ANGLE) - IN_ANGLE;\n    P = length(P)*vec2(cos(bn), abs(sin(bn)));\n    P -= size*vec2(COS_A, SIN_A)/2.;\n    P += vec2(COS_B, SIN_B)*clamp(-(P.x*COS_B + P.y*SIN_B), 0.0, size*SIN_A/SIN_B/2.);\n    return length(P)*sign(P.x);\n}\n#endif\n\n#ifdef USE_STAR_DOT\nfloat marker(vec2 P, float size)\n{\n    float dot_ = min(size/8.0 + v_linewidth/15.0 - u_antialias - length(P), 0.0);\n    float bn = mod(atan(P.x, -P.y), 2.0*IN_ANGLE) - IN_ANGLE;\n    P = length(P)*vec2(cos(bn), abs(sin(bn)));\n    P -= size*vec2(COS_A, SIN_A)/2.;\n    P += vec2(COS_B, SIN_B)*clamp(-(P.x*COS_B + P.y*SIN_B), 0.0, size*SIN_A/SIN_B/2.);\n    float star = length(P)*sign(P.x);\n    return max(star, dot_);\n}\n#endif\n\n#ifdef USE_TRIANGLE\n// triangle\nfloat marker(vec2 P, float size)\n{\n    P.y -= size * 0.3;\n    float x = SQRT_2 / 2.0 * (P.x * 1.7 - P.y);\n    float y = SQRT_2 / 2.0 * (P.x * 1.7 + P.y);\n    float r1 = max(abs(x), abs(y)) - size / 1.6;\n    float r2 = P.y;\n    return max(r1 / SQRT_2, r2);  // Intersect diamond with rectangle\n}\n#endif\n\n#ifdef USE_TRIANGLE_DOT\nfloat marker(vec2 P, float size)\n{\n    float dot_ = min(size/8.0 + v_linewidth/15.0 - u_antialias - length(P), 0.0);\n    P.y -= size * 0.3;\n    float x = SQRT_2 / 2.0 * (P.x * 1.7 - P.y);\n    float y = SQRT_2 / 2.0 * (P.x * 1.7 + P.y);\n    float r1 = max(abs(x), abs(y)) - size / 1.6;\n    float r2 = P.y;\n    float triangle = max(r1 / SQRT_2, r2);  // Intersect diamond with rectangle\n    return max(triangle, dot_);\n}\n#endif\n\n#ifdef USE_INVERTED_TRIANGLE\n// inverted_triangle\nfloat marker(vec2 P, float size)\n{\n    P.y += size * 0.3;\n    float x = SQRT_2 / 2.0 * (P.x * 1.7 - P.y);\n    float y = SQRT_2 / 2.0 * (P.x * 1.7 + P.y);\n    float r1 = max(abs(x), abs(y)) - size / 1.6;\n    float r2 = - P.y;\n    return max(r1 / SQRT_2, r2);  // Intersect diamond with rectangle\n}\n#endif\n\n#ifdef USE_CROSS\n// cross\nfloat marker(vec2 P, float size)\n{\n    float square = max(abs(P.x), abs(P.y)) - size / 2.0;\n    float cross = min(abs(P.x), abs(P.y));\n    cross = max(cross - v_linewidth/2.0 + u_antialias/2.0, 0.0);\n    return max(square, cross);\n}\n#endif\n\n#ifdef USE_DASH\nfloat marker(vec2 P, float size)\n{\n    float square = max(abs(P.x), abs(P.y)) - size / 2.0;\n    float cross = abs(P.y);\n    cross = max(cross - v_linewidth/2.0 + u_antialias/2.0, 0.0);\n    return max(square, cross);\n}\n#endif\n\n#ifdef USE_CIRCLE_CROSS\n// circle_cross\nfloat marker(vec2 P, float size)\n{\n    // Define quadrants\n    float qs = size / 2.0;  // quadrant size\n    float s1 = max(abs(P.x - qs), abs(P.y - qs)) - qs;\n    float s2 = max(abs(P.x + qs), abs(P.y - qs)) - qs;\n    float s3 = max(abs(P.x - qs), abs(P.y + qs)) - qs;\n    float s4 = max(abs(P.x + qs), abs(P.y + qs)) - qs;\n    // Intersect main shape with quadrants (to form cross)\n    float circle = length(P) - size/2.0;\n    float c1 = max(circle, s1);\n    float c2 = max(circle, s2);\n    float c3 = max(circle, s3);\n    float c4 = max(circle, s4);\n    // Union\n    return min(min(min(c1, c2), c3), c4);\n}\n#endif\n\n#ifdef USE_SQUARE_CROSS\n// square_cross\nfloat marker(vec2 P, float size)\n{\n    // Define quadrants\n    float qs = size / 2.0;  // quadrant size\n    float s1 = max(abs(P.x - qs), abs(P.y - qs)) - qs;\n    float s2 = max(abs(P.x + qs), abs(P.y - qs)) - qs;\n    float s3 = max(abs(P.x - qs), abs(P.y + qs)) - qs;\n    float s4 = max(abs(P.x + qs), abs(P.y + qs)) - qs;\n    // Intersect main shape with quadrants (to form cross)\n    float square = max(abs(P.x), abs(P.y)) - size/2.0;\n    float c1 = max(square, s1);\n    float c2 = max(square, s2);\n    float c3 = max(square, s3);\n    float c4 = max(square, s4);\n    // Union\n    return min(min(min(c1, c2), c3), c4);\n}\n#endif\n\n#ifdef USE_DIAMOND_CROSS\n// diamond_cross\nfloat marker(vec2 P, float size)\n{\n    // Define quadrants\n    float qs = size / 2.0;  // quadrant size\n    float s1 = max(abs(P.x - qs), abs(P.y - qs)) - qs;\n    float s2 = max(abs(P.x + qs), abs(P.y - qs)) - qs;\n    float s3 = max(abs(P.x - qs), abs(P.y + qs)) - qs;\n    float s4 = max(abs(P.x + qs), abs(P.y + qs)) - qs;\n    // Intersect main shape with quadrants (to form cross)\n    float x = SQRT_2 / 2.0 * (P.x * 1.5 - P.y);\n    float y = SQRT_2 / 2.0 * (P.x * 1.5 + P.y);\n    float diamond = max(abs(x), abs(y)) - size / (2.0 * SQRT_2);\n    diamond /= SQRT_2;\n    float c1 = max(diamond, s1);\n    float c2 = max(diamond, s2);\n    float c3 = max(diamond, s3);\n    float c4 = max(diamond, s4);\n    // Union\n    return min(min(min(c1, c2), c3), c4);\n}\n#endif\n\n#ifdef USE_X\n// x\nfloat marker(vec2 P, float size)\n{\n    float circle = length(P) - size / 2.0;\n    float X = min(abs(P.x - P.y), abs(P.x + P.y));\n    X = max(X - v_linewidth/2.0, 0.0);\n    return max(circle, X);\n}\n#endif\n\n#ifdef USE_Y\nfloat marker(vec2 P, float size)\n{\n    float circle = length(P) - size / 2.0;\n\n    float dx = 1.0 / SQRT_3;\n    float dy = SQRT_2 / SQRT_3;\n\n    // Sideways distance from the three spokes.\n    float d0 = abs(P.x);\n    float d1 = abs(dot(P, vec2(dx, dy)));\n    float d2 = abs(dot(P, vec2(dx, -dy)));\n\n    // Clip each spoke to semicircle.\n    d0 = max(d0, -P.y);\n    d1 = max(d1, dot(P, vec2(-dy, dx)));\n    d2 = max(d2, dot(P, vec2(dy, dx)));\n\n    float Y = min(min(d0, d1), d2);\n    Y = max(Y - v_linewidth/2.0 + u_antialias/2.0, 0.0);\n    return max(circle, Y);\n}\n#endif\n\n#ifdef USE_CIRCLE_X\n// circle_x\nfloat marker(vec2 P, float size)\n{\n    float x = P.x - P.y;\n    float y = P.x + P.y;\n    // Define quadrants\n    float qs = size / 2.0;  // quadrant size\n    float s1 = max(abs(x - qs), abs(y - qs)) - qs;\n    float s2 = max(abs(x + qs), abs(y - qs)) - qs;\n    float s3 = max(abs(x - qs), abs(y + qs)) - qs;\n    float s4 = max(abs(x + qs), abs(y + qs)) - qs;\n    // Intersect main shape with quadrants (to form cross)\n    float circle = length(P) - size/2.0;\n    float c1 = max(circle, s1);\n    float c2 = max(circle, s2);\n    float c3 = max(circle, s3);\n    float c4 = max(circle, s4);\n    // Union\n    return min(min(min(c1, c2), c3), c4);\n}\n#endif\n\n#ifdef USE_CIRCLE_Y\nfloat marker(vec2 P, float size)\n{\n    float circle = length(P) - size/2.0;\n\n    float dx = 1.0 / SQRT_3;\n    float dy = SQRT_2 / SQRT_3;\n\n    // Sideways distance from the three spokes.\n    float d0 = abs(P.x);\n    float d1 = abs(dot(P, vec2(dx, dy)));\n    float d2 = abs(dot(P, vec2(dx, -dy)));\n\n    // Clip each spoke to semicircle.\n    d0 = max(d0, -P.y);\n    d1 = max(d1, dot(P, vec2(-dy, dx)));\n    d2 = max(d2, dot(P, vec2(dy, dx)));\n\n    float Y = min(min(d0, d1), d2);\n    Y = min(v_linewidth/2.0 - u_antialias/2.0 - Y, 0.0);\n\n    return max(circle, Y);\n}\n#endif\n\n#ifdef USE_SQUARE_X\n// square_x\nfloat marker(vec2 P, float size)\n{\n    float x = P.x - P.y;\n    float y = P.x + P.y;\n    // Define quadrants\n    float qs = size / 2.0;  // quadrant size\n    float s1 = max(abs(x - qs), abs(y - qs)) - qs;\n    float s2 = max(abs(x + qs), abs(y - qs)) - qs;\n    float s3 = max(abs(x - qs), abs(y + qs)) - qs;\n    float s4 = max(abs(x + qs), abs(y + qs)) - qs;\n    // Intersect main shape with quadrants (to form cross)\n    float square = max(abs(P.x), abs(P.y)) - size/2.0;\n    float c1 = max(square, s1);\n    float c2 = max(square, s2);\n    float c3 = max(square, s3);\n    float c4 = max(square, s4);\n    // Union\n    return min(min(min(c1, c2), c3), c4);\n}\n#endif\n\n#ifdef USE_PLUS\nfloat marker(vec2 P, float size)\n{\n    vec2 size2 = vec2(size*0.5, size*0.2);\n    P = abs(P);\n    P = (P.y > P.x) ? P.yx : P.xy;\n    vec2 q = P - size2;\n    float k = max(q.y, q.x);\n    vec2 w = (k > 0.0) ? q : vec2(size2.y - P.x, -k);\n    return sign(k)*length(max(w, 0.0));\n}\n#endif\n\n#ifdef USE_SQUARE_PIN\nfloat marker(vec2 P, float size)\n{\n    float actual_size = size*1.2;\n    float radius = 0.75*actual_size; // Radius of curvature of edges.\n    float offset = actual_size/2.0 + sqrt(radius*radius - actual_size*actual_size/4.0);\n    vec2 centerx = vec2(offset, 0.0);\n    vec2 centery = vec2(0.0, offset);\n\n    float right = length(P - centerx);\n    float left = length(P + centerx);\n    float up = length(P - centery);\n    float down = length(P + centery);\n    float pin = radius - min(min(right, left), min(up, down));\n\n    float circle = length(P) - actual_size*0.6;\n    return max(circle, pin);\n}\n#endif\n\n#ifdef USE_TRIANGLE_PIN\nfloat marker(vec2 P, float size)\n{\n    float actual_size = size*1.2;\n    float radius = 1.2*actual_size; // Radius of curvature of edges.\n\n    float angle = 2.0*PI / 3.0;\n    float c = cos(angle);\n    float s = sin(angle);\n    mat2 rotation = mat2(c, -s, s, c);\n\n    // Half the length of straight triangle edge.\n    float half_edge = actual_size*SQRT_3/4.0;\n    // Distance from center of triangle to middle of straight edge.\n    float centre_middle_edge = 0.25*actual_size;\n    float offset = centre_middle_edge + sqrt(radius*radius - half_edge*half_edge);\n    // Centre of curvature.\n    vec2 center = vec2(0.0, offset);\n\n    float dist0 = length(P - center);\n    P = rotation*P;\n    float dist1 = length(P - center);\n    P = rotation*P;\n    float dist2 = length(P - center);\n    float pin = radius - min(min(dist0, dist1), dist2);\n\n    float circle = length(P) - actual_size / 2.0;\n    return max(circle, pin);\n}\n#endif\n\nvec4 outline(float distance, float linewidth, float antialias, vec4 line_color,\n             vec4 fill_color)\n{\n    vec4 frag_color;\n    float t = min(linewidth/2.0 - antialias, 0.0);  // Line half-width.\n    float signed_distance = distance;\n    float border_distance = abs(signed_distance) - t;\n    float alpha = border_distance/antialias;\n    alpha = exp(-alpha*alpha);\n\n    // If line alpha is zero, it probably means no outline. To avoid a dark\n    // outline shining through due to antialiasing, we set the line color to the\n    // fill color.\n    float select = float(bool(line_color.a));\n    line_color.rgb = select*line_color.rgb + (1.0 - select)*fill_color.rgb;\n    // Similarly, if we want a transparent fill.\n    select = float(bool(fill_color.a));\n    fill_color.rgb = select*fill_color.rgb + (1.0 - select)*line_color.rgb;\n\n    if (border_distance < 0.0)\n        frag_color = line_color;\n    else if (signed_distance < 0.0)\n        frag_color = mix(fill_color, line_color, sqrt(alpha));\n    else {\n        if (abs(signed_distance) < linewidth/2.0 + antialias)\n            frag_color = vec4(line_color.rgb, line_color.a*alpha);\n        else\n            discard;\n    }\n    return frag_color;\n}\n\nvoid main()\n{\n    float distance = marker(v_coords, v_size);\n    gl_FragColor = outline(\n        distance, v_linewidth, u_antialias, v_line_color, v_fill_color);\n    gl_FragColor.rgb *= gl_FragColor.a;  // Premultiplied alpha.\n}\n";
    exports.default = shader;
},
534: /* models/glyphs/webgl/rect.vert.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var shader = "\nprecision mediump float;\n\nattribute vec2 a_position;\nattribute vec2 a_center;\nattribute float a_width;\nattribute float a_height;\nattribute float a_angle; // In radians\nattribute float a_linewidth;\nattribute vec4 a_line_color;\nattribute vec4 a_fill_color;\nattribute float a_line_join;\nattribute float a_show;\n#ifdef HATCH\nattribute float a_hatch_pattern;\nattribute float a_hatch_scale;\nattribute float a_hatch_weight;\nattribute vec4 a_hatch_color;\n#endif\n\nuniform float u_pixel_ratio;\nuniform vec2 u_canvas_size;\nuniform float u_antialias;\n\nvarying float v_linewidth;\nvarying vec2 v_size; // 2D size for rects compared to 1D for markers.\nvarying vec4 v_line_color;\nvarying vec4 v_fill_color;\nvarying float v_line_join;\nvarying vec2 v_coords;\n#ifdef HATCH\nvarying float v_hatch_pattern;\nvarying float v_hatch_scale;\nvarying float v_hatch_weight;\nvarying vec4 v_hatch_color;\nvarying vec2 v_hatch_coords;\n#endif\n\nvoid main()\n{\n  if (a_show < 0.5) {\n    // Do not show this rect.\n    gl_Position = vec4(-2.0, -2.0, 0.0, 1.0);\n    return;\n  }\n\n  v_size = vec2(a_width, a_height);\n  v_linewidth = a_linewidth;\n  v_line_color = a_line_color;\n  v_fill_color = a_fill_color;\n  v_line_join = a_line_join;\n\n  if (v_linewidth < 1.0) {\n    // Linewidth less than 1 is implemented as 1 but with reduced alpha.\n    v_line_color.a *= v_linewidth;\n    v_linewidth = 1.0;\n  }\n\n#ifdef HATCH\n  v_hatch_pattern = a_hatch_pattern;\n  v_hatch_scale = a_hatch_scale;\n  v_hatch_weight = a_hatch_weight;\n  v_hatch_color = a_hatch_color;\n#endif\n\n  vec2 enclosing_size = v_size + v_linewidth + u_antialias;\n\n  // Coordinates in rotated frame with respect to center of marker, used for\n  // distance functions in fragment shader.\n  v_coords = a_position*enclosing_size;\n\n  float c = cos(-a_angle);\n  float s = sin(-a_angle);\n  mat2 rotation = mat2(c, -s, s, c);\n\n  vec2 pos = a_center + rotation*v_coords;\n#ifdef HATCH\n  // Coordinates for hatching in unrotated frame of reference.\n  v_hatch_coords = pos - 0.5;\n#endif\n  pos += 0.5; // Make up for Bokeh's offset.\n  pos /= u_canvas_size / u_pixel_ratio; // 0 to 1.\n  gl_Position = vec4(2.0*pos.x - 1.0, 1.0 - 2.0*pos.y, 0.0, 1.0);\n}\n";
    exports.default = shader;
},
535: /* models/glyphs/webgl/rect.frag.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var shader = "\nprecision mediump float;\n\nconst float SQRT2 = sqrt(2.0);\nconst float INVSQRT2 = 1.0/SQRT2;\nconst float PI = 3.14159265358979323846;\n\nconst int miter_join = 0;\nconst int round_join = 1;\nconst int bevel_join = 2;\n#ifdef HATCH\nconst int hatch_dot = 1;\nconst int hatch_ring = 2;\nconst int hatch_horizontal_line = 3;\nconst int hatch_vertical_line = 4;\nconst int hatch_cross = 5;\nconst int hatch_horizontal_dash = 6;\nconst int hatch_vertical_dash = 7;\nconst int hatch_spiral = 8;\nconst int hatch_right_diagonal_line = 9;\nconst int hatch_left_diagonal_line = 10;\nconst int hatch_diagonal_cross = 11;\nconst int hatch_right_diagonal_dash = 12;\nconst int hatch_left_diagonal_dash = 13;\nconst int hatch_horizontal_wave = 14;\nconst int hatch_vertical_wave = 15;\nconst int hatch_criss_cross = 16;\n#endif\n\nuniform float u_antialias;\n\nvarying float v_linewidth;\nvarying vec2 v_size;\nvarying vec4 v_line_color;\nvarying vec4 v_fill_color;\nvarying float v_line_join;\nvarying vec2 v_coords;\n#ifdef HATCH\nvarying float v_hatch_pattern;\nvarying float v_hatch_scale;\nvarying float v_hatch_weight;\nvarying vec4 v_hatch_color;\nvarying vec2 v_hatch_coords;\n#endif\n\n// Distance is zero on edge of marker, +ve outside and -ve inside.\nfloat marker_distance(vec2 p, int line_join)\n{\n  vec2 dist2 = abs(p) - v_size/2.0;\n  float dist = max(dist2.x, dist2.y);\n\n  if (dist2.x > 0.0 && dist2.y > 0.0) {\n    // Outside of corner needs correct join, default is miter.\n    if (line_join == round_join)\n      dist = length(dist2);\n    else if (line_join == bevel_join) {\n      vec2 normal = vec2(INVSQRT2, INVSQRT2);\n      dist = dot(dist2, normal) + 0.5*v_linewidth*(1.0 - INVSQRT2);\n    }\n  }\n\n  return dist;\n}\n\n// Convert distance from edge of marker to fraction in range 0 to 1, depending\n// on antialiasing width.\nfloat distance_to_fraction(float dist)\n{\n  return 1.0 - smoothstep(-0.5*u_antialias, 0.5*u_antialias, dist);\n}\n\n// Return fraction from 0 (no fill color) to 1 (full fill color).\nfloat fill_fraction(float dist)\n{\n  return distance_to_fraction(dist);\n}\n\n// Return fraction in range 0 (no line color) to 1 (full line color).\nfloat line_fraction(float dist)\n{\n  return distance_to_fraction(abs(dist) - 0.5*v_linewidth);\n}\n\n// Return fraction (in range 0 to 1) of a color, with premultiplied alpha.\nvec4 fractional_color(vec4 color, float fraction)\n{\n  color.a *= fraction;\n  color.rgb *= color.a;\n  return color;\n}\n\n// Blend colors that have premultiplied alpha.\nvec4 blend_colors(vec4 src, vec4 dest)\n{\n  return (1.0 - src.a)*dest + src;\n}\n\n#ifdef HATCH\n// Wrap coordinate(s) by removing integer part to give distance from center of\n// repeat, in the range -0.5 to +0.5.\nfloat wrap(float x)\n{\n  return fract(x) - 0.5;\n}\n\nvec2 wrap(vec2 xy)\n{\n  return fract(xy) - 0.5;\n}\n\n// Return fraction from 0 (no hatch color) to 1 (full hatch color).\nfloat hatch_fraction(vec2 coords, int hatch_pattern)\n{\n  float scale = v_hatch_scale; // Hatch repeat distance.\n\n  // Coordinates and linewidth/halfwidth are scaled to hatch repeat distance.\n  coords = coords / scale;\n  float halfwidth = 0.5*v_hatch_weight / scale; // Half the hatch linewidth.\n\n  // Default is to return fraction of zero, i.e. no pattern.\n  float dist = u_antialias;\n\n  if (hatch_pattern == hatch_dot) {\n    const float dot_radius = 0.25;\n    dist = length(wrap(coords)) - dot_radius;\n  }\n  else if (hatch_pattern == hatch_ring) {\n    const float ring_radius = 0.25;\n    dist = abs(length(wrap(coords)) - ring_radius) - halfwidth;\n  }\n  else if (hatch_pattern == hatch_horizontal_line) {\n    dist = abs(wrap(coords.y)) - halfwidth;\n  }\n  else if (hatch_pattern == hatch_vertical_line) {\n    dist = abs(wrap(coords.x)) - halfwidth;\n  }\n  else if (hatch_pattern == hatch_cross) {\n    dist = min(abs(wrap(coords.x)), abs(wrap(coords.y))) - halfwidth;\n  }\n  else if (hatch_pattern == hatch_horizontal_dash) {\n    // Dashes have square caps.\n    const float halflength = 0.25;\n    dist = max(abs(wrap(coords.y)),\n               abs(wrap(coords.x) + 0.25) - halflength) - halfwidth;\n  }\n  else if (hatch_pattern == hatch_vertical_dash) {\n    const float halflength = 0.25;\n    dist = max(abs(wrap(coords.x)),\n               abs(wrap(coords.y) + 0.25) - halflength) - halfwidth;\n  }\n  else if (hatch_pattern == hatch_spiral) {\n    vec2 wrap2 = wrap(coords);\n    float angle = wrap(atan(wrap2.y, wrap2.x) / (2.0*PI));\n    // Canvas spiral radius increases by scale*pi/15 each rotation.\n    const float dr = PI/15.0;\n    float radius = length(wrap2);\n    // At any angle, spiral lines are equally spaced dr apart.\n    // Find distance to nearest of these lines.\n    float frac = fract((radius - dr*angle) / dr); // 0 to 1.\n    dist = dr*(abs(frac - 0.5));\n    dist = min(dist, radius) - halfwidth; // Consider center point also.\n  }\n  else if (hatch_pattern == hatch_right_diagonal_line) {\n    dist = abs(wrap(2.0*coords.x + coords.y))/sqrt(5.0) - halfwidth;\n  }\n  else if (hatch_pattern == hatch_left_diagonal_line) {\n    dist = abs(wrap(2.0*coords.x - coords.y))/sqrt(5.0) - halfwidth;\n  }\n  else if (hatch_pattern == hatch_diagonal_cross) {\n    coords = vec2(coords.x + coords.y + 0.5, coords.x - coords.y + 0.5);\n    dist = min(abs(wrap(coords.x)), abs(wrap(coords.y))) / SQRT2 - halfwidth;\n  }\n  else if (hatch_pattern == hatch_right_diagonal_dash) {\n    float across = coords.x + coords.y + 0.5;\n    dist = abs(wrap(across)) / SQRT2; // Distance to nearest solid line.\n\n    across = floor(across); // Offset for dash.\n    float along = wrap(0.5*(coords.x - coords.y + across));\n    const float halflength = 0.25;\n    along = abs(along) - halflength; // Distance along line.\n\n    dist = max(dist, along) - halfwidth;\n  }\n  else if (hatch_pattern == hatch_left_diagonal_dash) {\n    float across = coords.x - coords.y + 0.5;\n    dist = abs(wrap(across)) / SQRT2; // Distance to nearest solid line.\n\n    across = floor(across); // Offset for dash.\n    float along = wrap(0.5*(coords.x + coords.y + across));\n    const float halflength = 0.25;\n    along = abs(along) - halflength; // Distance along line.\n\n    dist = max(dist, along) - halfwidth;\n  }\n  else if (hatch_pattern == hatch_horizontal_wave) {\n    float wrapx = wrap(coords.x);\n    float wrapy = wrap(coords.y - 0.25 + abs(wrapx));\n    dist = abs(wrapy) / SQRT2 - halfwidth;\n  }\n  else if (hatch_pattern == hatch_vertical_wave) {\n    float wrapy = wrap(coords.y);\n    float wrapx = wrap(coords.x - 0.25 + abs(wrapy));\n    dist = abs(wrapx) / SQRT2 - halfwidth;\n  }\n  else if (hatch_pattern == hatch_criss_cross) {\n    float plus = min(abs(wrap(coords.x)), abs(wrap(coords.y)));\n\n    coords = vec2(coords.x + coords.y + 0.5, coords.x - coords.y + 0.5);\n    float X = min(abs(wrap(coords.x)), abs(wrap(coords.y))) / SQRT2;\n\n    dist = min(plus, X) - halfwidth;\n  }\n\n  return distance_to_fraction(dist*scale);\n}\n#endif\n\nvoid main()\n{\n  int line_join = int(v_line_join + 0.5);\n#ifdef HATCH\n  int hatch_pattern = int(v_hatch_pattern + 0.5);\n#endif\n\n  float dist = marker_distance(v_coords, line_join);\n\n  float fill_frac = fill_fraction(dist);\n  vec4 color = fractional_color(v_fill_color, fill_frac);\n\n#ifdef HATCH\n  if (hatch_pattern > 0 && fill_frac > 0.0) {\n    float hatch_frac = hatch_fraction(v_hatch_coords, hatch_pattern);\n    vec4 hatch_color = fractional_color(v_hatch_color, hatch_frac*fill_frac);\n    color = blend_colors(hatch_color, color);\n  }\n#endif\n\n  float line_frac = line_fraction(dist);\n  if (line_frac > 0.0) {\n    vec4 line_color = fractional_color(v_line_color, line_frac);\n    color = blend_colors(line_color, color);\n  }\n\n  gl_FragColor = color;\n}\n";
    exports.default = shader;
},
536: /* models/glyphs/webgl/line_gl.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var tslib_1 = require(1) /* tslib */;
    var base_1 = require(537) /* ./base */;
    var color_1 = require(137) /* ../../../core/util/color */;
    var line_1 = require(161) /* ../../../core/visuals/line */;
    var webgl_utils_1 = require(538) /* ./webgl_utils */;
    var buffer_1 = require(539) /* ./buffer */;
    // Avoiding use of nan or inf to represent missing data in webgl as shaders may
    // have reduced floating point precision.  So here using a large-ish negative
    // value instead.
    var missing_point = -10000.0;
    var missing_point_threshold = -9000.0;
    var LineGL = /** @class */ (function (_super) {
        (0, tslib_1.__extends)(LineGL, _super);
        function LineGL(regl_wrapper, glyph) {
            var _this = _super.call(this, regl_wrapper, glyph) || this;
            _this.glyph = glyph;
            _this._antialias = 1.5; // Make this larger to test antialiasing at edges.
            _this._miter_limit = 5.0; // Threshold for miters to be replaced by bevels.
            return _this;
        }
        LineGL.prototype.draw = function (_indices, mainGlyph, transform) {
            // _indices are currently ignored.
            var mainGlGlyph = mainGlyph.glglyph;
            if (this.visuals_changed) {
                this._set_visuals();
                this.visuals_changed = false;
            }
            if (mainGlGlyph.data_changed) {
                mainGlGlyph._set_data();
                mainGlGlyph.data_changed = false;
            }
            var line_visuals = this.glyph.visuals.line;
            var line_cap = webgl_utils_1.cap_lookup[line_visuals.line_cap.value];
            var line_join = webgl_utils_1.join_lookup[line_visuals.line_join.value];
            if (this._is_dashed()) {
                var props = {
                    scissor: this.regl_wrapper.scissor,
                    viewport: this.regl_wrapper.viewport,
                    canvas_size: [transform.width, transform.height],
                    pixel_ratio: transform.pixel_ratio,
                    line_color: this._color,
                    linewidth: this._linewidth,
                    antialias: this._antialias,
                    miter_limit: this._miter_limit,
                    points: mainGlGlyph._points,
                    nsegments: mainGlGlyph._nsegments,
                    line_join: line_join,
                    line_cap: line_cap,
                    length_so_far: mainGlGlyph._length_so_far,
                    dash_tex: this._dash_tex,
                    dash_tex_info: this._dash_tex_info,
                    dash_scale: this._dash_scale,
                    dash_offset: this._dash_offset,
                };
                this.regl_wrapper.dashed_line()(props);
            }
            else {
                var props = {
                    scissor: this.regl_wrapper.scissor,
                    viewport: this.regl_wrapper.viewport,
                    canvas_size: [transform.width, transform.height],
                    pixel_ratio: transform.pixel_ratio,
                    line_color: this._color,
                    linewidth: this._linewidth,
                    antialias: this._antialias,
                    miter_limit: this._miter_limit,
                    points: mainGlGlyph._points,
                    nsegments: mainGlGlyph._nsegments,
                    line_join: line_join,
                    line_cap: line_cap,
                };
                this.regl_wrapper.solid_line()(props);
            }
        };
        LineGL.prototype._is_dashed = function () {
            return this._line_dash.length > 0;
        };
        LineGL.prototype._set_data = function () {
            var npoints = this.glyph.sx.length;
            this._nsegments = npoints - 1;
            if (this._is_closed == null) {
                this._is_closed = (this.glyph.sx[0] == this.glyph.sx[npoints - 1] &&
                    this.glyph.sy[0] == this.glyph.sy[npoints - 1] &&
                    isFinite(this.glyph.sx[0]) &&
                    isFinite(this.glyph.sy[0]));
            }
            if (this._points == null)
                this._points = new buffer_1.Float32Buffer(this.regl_wrapper);
            var points_array = this._points.get_sized_array((npoints + 2) * 2);
            for (var i = 1; i < npoints + 1; i++) {
                if (isFinite(this.glyph.sx[i - 1]) && isFinite(this.glyph.sy[i - 1])) {
                    points_array[2 * i] = this.glyph.sx[i - 1];
                    points_array[2 * i + 1] = this.glyph.sy[i - 1];
                }
                else {
                    points_array[2 * i] = missing_point;
                    points_array[2 * i + 1] = missing_point;
                }
            }
            if (this._is_closed) {
                points_array[0] = points_array[2 * npoints - 2]; // Last but one point.
                points_array[1] = points_array[2 * npoints - 1];
                points_array[2 * npoints + 2] = points_array[4]; // Second point.
                points_array[2 * npoints + 3] = points_array[5];
            }
            else {
                points_array[0] = missing_point;
                points_array[1] = missing_point;
                points_array[2 * npoints + 2] = missing_point;
                points_array[2 * npoints + 3] = missing_point;
            }
            this._points.update();
            if (this._is_dashed()) {
                if (this._length_so_far == null)
                    this._length_so_far = new buffer_1.Float32Buffer(this.regl_wrapper);
                var lengths_array = this._length_so_far.get_sized_array(this._nsegments);
                var length = 0.0;
                for (var i = 0; i < this._nsegments; i++) {
                    lengths_array[i] = length;
                    if (points_array[2 * i + 2] > missing_point_threshold &&
                        points_array[2 * i + 4] > missing_point_threshold)
                        length += Math.sqrt(Math.pow((points_array[2 * i + 4] - points_array[2 * i + 2]), 2) +
                            Math.pow((points_array[2 * i + 5] - points_array[2 * i + 3]), 2));
                }
                this._length_so_far.update();
            }
        };
        LineGL.prototype._set_visuals = function () {
            var _a;
            var line_visuals = this.glyph.visuals.line;
            var color = (0, color_1.color2rgba)(line_visuals.line_color.value, line_visuals.line_alpha.value);
            this._color = color.map(function (val) { return val / 255; });
            this._linewidth = line_visuals.line_width.value;
            if (this._linewidth < 1.0) {
                // Linewidth less than 1 is implemented as 1 but with reduced alpha.
                this._color[3] *= this._linewidth;
                this._linewidth = 1.0;
            }
            this._line_dash = (0, line_1.resolve_line_dash)(line_visuals.line_dash.value);
            if (this._line_dash.length == 1)
                // Dash pattern of single number means gap is same length as dash.
                this._line_dash.push(this._line_dash[0]);
            if (this._is_dashed()) {
                _a = (0, tslib_1.__read)(this.regl_wrapper.get_dash(this._line_dash), 3), this._dash_tex_info = _a[0], this._dash_tex = _a[1], this._dash_scale = _a[2];
                this._dash_offset = line_visuals.line_dash_offset.value;
            }
        };
        return LineGL;
    }(base_1.BaseGLGlyph));
    exports.LineGL = LineGL;
    LineGL.__name__ = "LineGL";
},
537: /* models/glyphs/webgl/base.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var BaseGLGlyph = /** @class */ (function () {
        function BaseGLGlyph(regl_wrapper, glyph) {
            this.glyph = glyph;
            this.nvertices = 0;
            this.size_changed = false;
            this.data_changed = false;
            this.visuals_changed = false;
            this.regl_wrapper = regl_wrapper;
        }
        BaseGLGlyph.prototype.set_data_changed = function () {
            var data_size = this.glyph.data_size;
            if (data_size != this.nvertices) {
                this.nvertices = data_size;
                this.size_changed = true;
            }
            this.data_changed = true;
        };
        BaseGLGlyph.prototype.set_visuals_changed = function () {
            this.visuals_changed = true;
        };
        BaseGLGlyph.prototype.render = function (_ctx, indices, mainglyph) {
            if (indices.length == 0) {
                return true;
            }
            var _a = this.glyph.renderer.plot_view.canvas_view.webgl.canvas, width = _a.width, height = _a.height;
            var trans = {
                pixel_ratio: this.glyph.renderer.plot_view.canvas_view.pixel_ratio,
                width: width,
                height: height,
            };
            this.draw(indices, mainglyph, trans);
            return true;
        };
        return BaseGLGlyph;
    }());
    exports.BaseGLGlyph = BaseGLGlyph;
    BaseGLGlyph.__name__ = "BaseGLGlyph";
},
538: /* models/glyphs/webgl/webgl_utils.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var patterns_1 = require(167) /* ../../../core/visuals/patterns */;
    // WebGL shaders use integers for caps, joins and hatching.
    exports.cap_lookup = { butt: 0, round: 1, square: 2 };
    exports.join_lookup = { miter: 0, round: 1, bevel: 2 };
    var hatch_pattern_lookup = {
        blank: 0,
        dot: 1,
        ring: 2,
        horizontal_line: 3,
        vertical_line: 4,
        cross: 5,
        horizontal_dash: 6,
        vertical_dash: 7,
        spiral: 8,
        right_diagonal_line: 9,
        left_diagonal_line: 10,
        diagonal_cross: 11,
        right_diagonal_dash: 12,
        left_diagonal_dash: 13,
        horizontal_wave: 14,
        vertical_wave: 15,
        criss_cross: 16,
    };
    function hatch_pattern_to_index(pattern) {
        var _a, _b;
        return (_b = hatch_pattern_lookup[(_a = patterns_1.hatch_aliases[pattern]) !== null && _a !== void 0 ? _a : pattern]) !== null && _b !== void 0 ? _b : 0;
    }
    exports.hatch_pattern_to_index = hatch_pattern_to_index;
},
539: /* models/glyphs/webgl/buffer.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var tslib_1 = require(1) /* tslib */;
    var webgl_utils_1 = require(538) /* ./webgl_utils */;
    var color_1 = require(137) /* ../../../core/util/color */;
    // Arrays are sent to GPU using ReGL Buffer objects.  CPU-side arrays used to
    // update the Buffers are also kept for reuse to avoid unnecessary reallocation.
    var WrappedBuffer = /** @class */ (function () {
        function WrappedBuffer(regl_wrapper) {
            this.regl_wrapper = regl_wrapper;
            this.is_scalar = true;
        }
        // Return array of correct size, creating it if necessary.
        // Must call update() when finished setting the array values.
        WrappedBuffer.prototype.get_sized_array = function (length) {
            if (this.array == null || this.array.length != length)
                this.array = this.new_array(length);
            return this.array;
        };
        WrappedBuffer.prototype.is_normalized = function () {
            return false;
        };
        Object.defineProperty(WrappedBuffer.prototype, "length", {
            get: function () {
                return this.array != null ? this.array.length : 0;
            },
            enumerable: false,
            configurable: true
        });
        WrappedBuffer.prototype.set_from_array = function (numbers) {
            var len = numbers.length;
            var array = this.get_sized_array(len);
            for (var i = 0; i < len; i++)
                array[i] = numbers[i];
            this.update();
        };
        // length_if_scalar is the number of vertices in the WebGL primitive used to
        // render the glyph; usually this is a rectangle with 4 vertices.
        WrappedBuffer.prototype.set_from_prop = function (prop, length_if_scalar) {
            if (length_if_scalar === void 0) {
                length_if_scalar = 4;
            }
            var len = prop.is_Scalar() ? length_if_scalar : prop.length;
            var array = this.get_sized_array(len);
            for (var i = 0; i < len; i++)
                array[i] = prop.get(i);
            this.update(prop.is_Scalar());
        };
        // Return a ReGL AttributeConfig that corresponds to one value for each glyph
        // or the same value for all glyphs.  Instanced rendering supports the former
        // using 'divisor = 1', but does not support the latter directly.  We have to
        // either repeat the attribute once for each glyph, which is wasteful for a
        // large number of glyphs, or the solution used here which is to use
        // 'divisor = 0' and repeat the value once for each of the instanced vertices
        // which is usually 4.  See also set_from_prop() above.
        WrappedBuffer.prototype.to_attribute_config = function (offset) {
            if (offset === void 0) {
                offset = 0;
            }
            return {
                buffer: this.buffer,
                divisor: this.is_scalar ? 0 : 1,
                normalized: this.is_normalized(),
                offset: offset,
            };
        };
        // Update ReGL buffer with data contained in array in preparation for passing
        // it to the GPU.  This function must be called after get_sized_array().
        WrappedBuffer.prototype.update = function (is_scalar) {
            if (is_scalar === void 0) {
                is_scalar = false;
            }
            // Update buffer with data contained in array.
            if (this.buffer == null) {
                // Create new buffer.
                this.buffer = this.regl_wrapper.buffer({
                    usage: "dynamic",
                    data: this.array,
                });
            }
            else {
                // Reuse existing buffer.
                this.buffer({ data: this.array });
            }
            this.is_scalar = is_scalar;
        };
        return WrappedBuffer;
    }());
    WrappedBuffer.__name__ = "WrappedBuffer";
    var Float32Buffer = /** @class */ (function (_super) {
        (0, tslib_1.__extends)(Float32Buffer, _super);
        function Float32Buffer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Float32Buffer.prototype.new_array = function (len) {
            return new Float32Array(len);
        };
        return Float32Buffer;
    }(WrappedBuffer));
    exports.Float32Buffer = Float32Buffer;
    Float32Buffer.__name__ = "Float32Buffer";
    var Uint8Buffer = /** @class */ (function (_super) {
        (0, tslib_1.__extends)(Uint8Buffer, _super);
        function Uint8Buffer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Uint8Buffer.prototype.new_array = function (len) {
            return new Uint8Array(len);
        };
        Uint8Buffer.prototype.set_from_color = function (color_prop, alpha_prop, length_if_scalar) {
            if (length_if_scalar === void 0) {
                length_if_scalar = 4;
            }
            var is_scalar = color_prop.is_Scalar() && alpha_prop.is_Scalar();
            var ncolors = is_scalar ? length_if_scalar : color_prop.length;
            var array = this.get_sized_array(4 * ncolors);
            for (var i = 0; i < ncolors; i++) {
                var _a = (0, tslib_1.__read)((0, color_1.color2rgba)(color_prop.get(i), alpha_prop.get(i)), 4), r = _a[0], g = _a[1], b = _a[2], a = _a[3];
                array[4 * i] = r;
                array[4 * i + 1] = g;
                array[4 * i + 2] = b;
                array[4 * i + 3] = a;
            }
            this.update(is_scalar);
        };
        Uint8Buffer.prototype.set_from_hatch_pattern = function (hatch_pattern_prop, length_if_scalar) {
            if (length_if_scalar === void 0) {
                length_if_scalar = 4;
            }
            var len = hatch_pattern_prop.is_Scalar() ? length_if_scalar : hatch_pattern_prop.length;
            var array = this.get_sized_array(len);
            for (var i = 0; i < len; i++)
                array[i] = (0, webgl_utils_1.hatch_pattern_to_index)(hatch_pattern_prop.get(i));
            this.update(hatch_pattern_prop.is_Scalar());
        };
        Uint8Buffer.prototype.set_from_line_join = function (line_join_prop, length_if_scalar) {
            if (length_if_scalar === void 0) {
                length_if_scalar = 4;
            }
            var len = line_join_prop.is_Scalar() ? length_if_scalar : line_join_prop.length;
            var array = this.get_sized_array(len);
            for (var i = 0; i < len; i++)
                array[i] = webgl_utils_1.join_lookup[line_join_prop.get(i)];
            this.update(line_join_prop.is_Scalar());
        };
        return Uint8Buffer;
    }(WrappedBuffer));
    exports.Uint8Buffer = Uint8Buffer;
    Uint8Buffer.__name__ = "Uint8Buffer";
    // Normalized refers to optional WebGL behaviour of automatically converting
    // Uint8 values that are passed to shaders into floats in the range 0 to 1.
    var NormalizedUint8Buffer = /** @class */ (function (_super) {
        (0, tslib_1.__extends)(NormalizedUint8Buffer, _super);
        function NormalizedUint8Buffer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NormalizedUint8Buffer.prototype.is_normalized = function () {
            return true;
        };
        return NormalizedUint8Buffer;
    }(Uint8Buffer));
    exports.NormalizedUint8Buffer = NormalizedUint8Buffer;
    NormalizedUint8Buffer.__name__ = "NormalizedUint8Buffer";
},
540: /* models/glyphs/webgl/rect.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var tslib_1 = require(1) /* tslib */;
    var base_1 = require(537) /* ./base */;
    var buffer_1 = require(539) /* ./buffer */;
    // Avoiding use of nan or inf to represent missing data in webgl as shaders may
    // have reduced floating point precision.  So here using a large-ish negative
    // value instead.
    var missing_point = -10000;
    var RectGL = /** @class */ (function (_super) {
        (0, tslib_1.__extends)(RectGL, _super);
        function RectGL(regl_wrapper, glyph) {
            var _this = _super.call(this, regl_wrapper, glyph) || this;
            _this.glyph = glyph;
            _this._antialias = 1.5;
            return _this;
        }
        RectGL.prototype.draw = function (indices, main_glyph, transform) {
            // The main glyph has the data, this glyph has the visuals.
            var mainGlGlyph = main_glyph.glglyph;
            if (mainGlGlyph.data_changed) {
                mainGlGlyph._set_data();
                mainGlGlyph.data_changed = false;
            }
            if (this.visuals_changed) {
                this._set_visuals();
                this.visuals_changed = false;
            }
            var nmarkers = mainGlGlyph._centers.length / 2;
            if (this._show == null)
                this._show = new buffer_1.Uint8Buffer(this.regl_wrapper);
            var prev_nmarkers = this._show.length;
            var show_array = this._show.get_sized_array(nmarkers);
            if (indices.length < nmarkers) {
                this._show_all = false;
                // Reset all show values to zero.
                for (var i = 0; i < nmarkers; i++)
                    show_array[i] = 0;
                // Set show values of markers to render to 255.
                for (var j = 0; j < indices.length; j++) {
                    show_array[indices[j]] = 255;
                }
            }
            else if (!this._show_all || prev_nmarkers != nmarkers) {
                this._show_all = true;
                for (var i = 0; i < nmarkers; i++)
                    show_array[i] = 255;
            }
            this._show.update();
            if (this._have_hatch) {
                var props = {
                    scissor: this.regl_wrapper.scissor,
                    viewport: this.regl_wrapper.viewport,
                    canvas_size: [transform.width, transform.height],
                    pixel_ratio: transform.pixel_ratio,
                    center: mainGlGlyph._centers,
                    width: mainGlGlyph._widths,
                    height: mainGlGlyph._heights,
                    angle: mainGlGlyph._angles,
                    nmarkers: nmarkers,
                    antialias: this._antialias,
                    linewidth: this._linewidths,
                    line_color: this._line_rgba,
                    fill_color: this._fill_rgba,
                    line_join: this._line_joins,
                    show: this._show,
                    hatch_pattern: this._hatch_patterns,
                    hatch_scale: this._hatch_scales,
                    hatch_weight: this._hatch_weights,
                    hatch_color: this._hatch_rgba,
                };
                this.regl_wrapper.rect_hatch()(props);
            }
            else {
                var props = {
                    scissor: this.regl_wrapper.scissor,
                    viewport: this.regl_wrapper.viewport,
                    canvas_size: [transform.width, transform.height],
                    pixel_ratio: transform.pixel_ratio,
                    center: mainGlGlyph._centers,
                    width: mainGlGlyph._widths,
                    height: mainGlGlyph._heights,
                    angle: mainGlGlyph._angles,
                    nmarkers: nmarkers,
                    antialias: this._antialias,
                    linewidth: this._linewidths,
                    line_color: this._line_rgba,
                    fill_color: this._fill_rgba,
                    line_join: this._line_joins,
                    show: this._show,
                };
                this.regl_wrapper.rect_no_hatch()(props);
            }
        };
        RectGL.prototype._set_data = function () {
            var nmarkers = this.glyph.sx.length;
            if (this._centers == null) {
                // Either all or none are set.
                this._centers = new buffer_1.Float32Buffer(this.regl_wrapper);
                this._widths = new buffer_1.Float32Buffer(this.regl_wrapper);
                this._heights = new buffer_1.Float32Buffer(this.regl_wrapper);
                this._angles = new buffer_1.Float32Buffer(this.regl_wrapper);
            }
            var centers_array = this._centers.get_sized_array(nmarkers * 2);
            for (var i = 0; i < nmarkers; i++) {
                if (isFinite(this.glyph.sx[i]) && isFinite(this.glyph.sy[i])) {
                    centers_array[2 * i] = this.glyph.sx[i];
                    centers_array[2 * i + 1] = this.glyph.sy[i];
                }
                else {
                    centers_array[2 * i] = missing_point;
                    centers_array[2 * i + 1] = missing_point;
                }
            }
            this._centers.update();
            this._widths.set_from_array(this.glyph.sw);
            this._heights.set_from_array(this.glyph.sh);
            this._angles.set_from_prop(this.glyph.angle);
        };
        RectGL.prototype._set_visuals = function () {
            var fill = this.glyph.visuals.fill;
            var line = this.glyph.visuals.line;
            if (this._linewidths == null) {
                // Either all or none are set.
                this._linewidths = new buffer_1.Float32Buffer(this.regl_wrapper);
                this._line_joins = new buffer_1.Uint8Buffer(this.regl_wrapper);
                this._line_rgba = new buffer_1.NormalizedUint8Buffer(this.regl_wrapper);
                this._fill_rgba = new buffer_1.NormalizedUint8Buffer(this.regl_wrapper);
            }
            this._linewidths.set_from_prop(line.line_width);
            this._line_joins.set_from_line_join(line.line_join);
            this._line_rgba.set_from_color(line.line_color, line.line_alpha);
            this._fill_rgba.set_from_color(fill.fill_color, fill.fill_alpha);
            this._have_hatch = this.glyph.visuals.hatch.doit;
            if (this._have_hatch) {
                var hatch = this.glyph.visuals.hatch;
                if (this._hatch_patterns == null) {
                    // Either all or none are set.
                    this._hatch_patterns = new buffer_1.Uint8Buffer(this.regl_wrapper);
                    this._hatch_scales = new buffer_1.Float32Buffer(this.regl_wrapper);
                    this._hatch_weights = new buffer_1.Float32Buffer(this.regl_wrapper);
                    this._hatch_rgba = new buffer_1.NormalizedUint8Buffer(this.regl_wrapper);
                }
                this._hatch_patterns.set_from_hatch_pattern(hatch.hatch_pattern);
                this._hatch_scales.set_from_prop(hatch.hatch_scale);
                this._hatch_weights.set_from_prop(hatch.hatch_weight);
                this._hatch_rgba.set_from_color(hatch.hatch_color, hatch.hatch_alpha);
            }
        };
        return RectGL;
    }(base_1.BaseGLGlyph));
    exports.RectGL = RectGL;
    RectGL.__name__ = "RectGL";
},
541: /* models/glyphs/webgl/markers.js */ function _(require, module, exports, __esModule, __esExport) {
    __esModule();
    var tslib_1 = require(1) /* tslib */;
    var base_1 = require(537) /* ./base */;
    var buffer_1 = require(539) /* ./buffer */;
    // Avoiding use of nan or inf to represent missing data in webgl as shaders may
    // have reduced floating point precision.  So here using a large-ish negative
    // value instead.
    var missing_point = -10000;
    // XXX: this is needed to cut circular dependency between this and models/glyphs/circle
    function is_CircleView(glyph_view) {
        return glyph_view.model.type == "Circle";
    }
    // Base class for markers. All markers share the same GLSL, except for one
    // function in the fragment shader that defines the marker geometry and is
    // enabled through a #define.
    var MarkerGL = /** @class */ (function (_super) {
        (0, tslib_1.__extends)(MarkerGL, _super);
        function MarkerGL(regl_wrapper, glyph, marker_type) {
            var _this = _super.call(this, regl_wrapper, glyph) || this;
            _this.glyph = glyph;
            _this.marker_type = marker_type;
            _this._marker_type = marker_type;
            _this._antialias = 0.8;
            _this._show_all = false;
            return _this;
        }
        MarkerGL.is_supported = function (marker_type) {
            switch (marker_type) {
                case "asterisk":
                case "circle":
                case "circle_cross":
                case "circle_dot":
                case "circle_x":
                case "circle_y":
                case "cross":
                case "dash":
                case "diamond":
                case "diamond_cross":
                case "diamond_dot":
                case "dot":
                case "hex":
                case "hex_dot":
                case "inverted_triangle":
                case "plus":
                case "square":
                case "square_cross":
                case "square_dot":
                case "square_pin":
                case "square_x":
                case "star":
                case "star_dot":
                case "triangle":
                case "triangle_dot":
                case "triangle_pin":
                case "x":
                case "y":
                    return true;
                default:
                    return false;
            }
        };
        MarkerGL.prototype.draw = function (indices, main_glyph, transform) {
            // The main glyph has the data, this glyph has the visuals.
            var mainGlGlyph = main_glyph.glglyph;
            // Temporary solution for circles to always force call to _set_data.
            // Correct solution depends on keeping the webgl properties constant and
            // only changing the indices, which in turn depends on the correct webgl
            // instanced rendering.
            if (mainGlGlyph.data_changed || is_CircleView(this.glyph)) {
                mainGlGlyph._set_data();
                mainGlGlyph.data_changed = false;
            }
            if (this.visuals_changed) {
                this._set_visuals();
                this.visuals_changed = false;
            }
            var nmarkers = mainGlGlyph._centers.length / 2;
            if (this._show == null)
                this._show = new buffer_1.Uint8Buffer(this.regl_wrapper);
            var prev_nmarkers = this._show.length;
            var show_array = this._show.get_sized_array(nmarkers);
            if (indices.length < nmarkers) {
                this._show_all = false;
                // Reset all show values to zero.
                for (var i = 0; i < nmarkers; i++)
                    show_array[i] = 0;
                // Set show values of markers to render to 255.
                for (var j = 0; j < indices.length; j++) {
                    show_array[indices[j]] = 255;
                }
            }
            else if (!this._show_all || prev_nmarkers != nmarkers) {
                this._show_all = true;
                for (var i = 0; i < nmarkers; i++)
                    show_array[i] = 255;
            }
            this._show.update();
            var props = {
                scissor: this.regl_wrapper.scissor,
                viewport: this.regl_wrapper.viewport,
                canvas_size: [transform.width, transform.height],
                pixel_ratio: transform.pixel_ratio,
                center: mainGlGlyph._centers,
                size: mainGlGlyph._sizes,
                angle: mainGlGlyph._angles,
                nmarkers: nmarkers,
                antialias: this._antialias,
                linewidth: this._linewidths,
                line_color: this._line_rgba,
                fill_color: this._fill_rgba,
                show: this._show,
            };
            this.regl_wrapper.marker(this._marker_type)(props);
        };
        MarkerGL.prototype._set_data = function () {
            var nmarkers = this.glyph.sx.length;
            if (this._centers == null) {
                // Either all or none are set.
                this._centers = new buffer_1.Float32Buffer(this.regl_wrapper);
                this._sizes = new buffer_1.Float32Buffer(this.regl_wrapper);
                this._angles = new buffer_1.Float32Buffer(this.regl_wrapper);
            }
            var centers_array = this._centers.get_sized_array(nmarkers * 2);
            for (var i = 0; i < nmarkers; i++) {
                if (isFinite(this.glyph.sx[i]) && isFinite(this.glyph.sy[i])) {
                    centers_array[2 * i] = this.glyph.sx[i];
                    centers_array[2 * i + 1] = this.glyph.sy[i];
                }
                else {
                    centers_array[2 * i] = missing_point;
                    centers_array[2 * i + 1] = missing_point;
                }
            }
            this._centers.update();
            if (is_CircleView(this.glyph) && this.glyph.radius != null) {
                var sizes_array = this._sizes.get_sized_array(nmarkers);
                for (var i = 0; i < nmarkers; i++)
                    sizes_array[i] = this.glyph.sradius[i] * 2;
                this._sizes.update();
            }
            else {
                this._sizes.set_from_prop(this.glyph.size);
            }
            this._angles.set_from_prop(this.glyph.angle);
        };
        MarkerGL.prototype._set_visuals = function () {
            var fill = this.glyph.visuals.fill;
            var line = this.glyph.visuals.line;
            if (this._linewidths == null) {
                // Either all or none are set.
                this._linewidths = new buffer_1.Float32Buffer(this.regl_wrapper);
                this._line_rgba = new buffer_1.NormalizedUint8Buffer(this.regl_wrapper);
                this._fill_rgba = new buffer_1.NormalizedUint8Buffer(this.regl_wrapper);
            }
            this._linewidths.set_from_prop(line.line_width);
            this._line_rgba.set_from_color(line.line_color, line.line_alpha);
            this._fill_rgba.set_from_color(fill.fill_color, fill.fill_alpha);
        };
        return MarkerGL;
    }(base_1.BaseGLGlyph));
    exports.MarkerGL = MarkerGL;
    MarkerGL.__name__ = "MarkerGL";
},
}, 524, {"models/glyphs/webgl/main":524,"models/glyphs/webgl/index":525,"models/glyphs/webgl/regl_wrap":526,"models/glyphs/webgl/dash_cache":528,"models/glyphs/webgl/utils/math":529,"models/glyphs/webgl/regl_line.vert":530,"models/glyphs/webgl/regl_line.frag":531,"models/glyphs/webgl/markers.vert":532,"models/glyphs/webgl/markers.frag":533,"models/glyphs/webgl/rect.vert":534,"models/glyphs/webgl/rect.frag":535,"models/glyphs/webgl/line_gl":536,"models/glyphs/webgl/base":537,"models/glyphs/webgl/webgl_utils":538,"models/glyphs/webgl/buffer":539,"models/glyphs/webgl/rect":540,"models/glyphs/webgl/markers":541}, {});});
//# sourceMappingURL=bokeh-gl.legacy.js.map
