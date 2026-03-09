"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupermarketList = void 0;
class SupermarketList {
    constructor() {
        this.items = ["Bread", "Butter", "Eggs", "Greek yogurt"];
    }
    getList() {
        return [...this.items];
    }
    addItem(item) {
        this.items.push(item);
    }
}
exports.SupermarketList = SupermarketList;
