interface View {
    show():void;
    hide():void;
    getDom():Element;
    getViewName():string;
    events:Dictionary;
    parseSrc():void;
}