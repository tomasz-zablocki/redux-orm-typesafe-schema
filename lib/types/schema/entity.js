"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Entity = (function () {
    function Entity() {
        var _this = this;
        this.oneToOne = function (to) {
            return {
                ref: function (reverseField) { return ({
                    fieldType: 'OneToOne',
                    virtual: false,
                    from: _this.entityClass(),
                    to: to,
                    reverseField: reverseField
                }); },
                virtualRef: function (reverseField) { return ({
                    fieldType: 'OneToOne',
                    virtual: true,
                    from: _this.entityClass(),
                    to: to,
                    reverseField: reverseField
                }); }
            };
        };
        this.oneToMany = function (to) { return ({
            ref: function (reverseField) { return ({
                fieldType: 'OneToMany',
                virtual: true,
                from: _this.entityClass(),
                to: to,
                reverseField: reverseField
            }); }
        }); };
        this.manyToOne = function (to) {
            var build = function (options) { return (tslib_1.__assign({ fieldType: 'ManyToOne', virtual: false, from: _this.entityClass(), to: to }, options)); };
            return {
                ref: function (reverseField) { return build({ reverseField: reverseField }); },
                noRef: build
            };
        };
        this.manyToMany = function (to) { return ({
            through: function (through) { return ({
                virtualRef: function (reverseField, throughReverseField) { return ({
                    fieldType: 'ManyToMany',
                    virtual: true,
                    from: _this.entityClass(),
                    to: to,
                    through: through,
                    reverseField: reverseField,
                    throughReverseField: throughReverseField
                }); },
                ref: function (reverseField, throughReverseField) { return ({
                    fieldType: 'ManyToMany',
                    virtual: false,
                    from: _this.entityClass(),
                    to: to,
                    through: through,
                    reverseField: reverseField,
                    throughReverseField: throughReverseField
                }); }
            }); }
        }); };
    }
    Entity.prototype.entityClass = function () {
        return this.constructor;
    };
    Entity.prototype.reduce = function (action, repository, repositories) { };
    Entity.prototype.attribute = function (supplier) {
        return {
            fieldType: 'Attribute',
            from: this.entityClass(),
            virtual: false,
            supplier: supplier
        };
    };
    return Entity;
}());
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map