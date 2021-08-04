/**
 * Simple utility CSS-in-JS implementation.
 */
export class StyleManager {

  private _classNamePrefixBase = '__markerjslive_';
  /**
   * Static CSS class name used for the wrapper element.
   */
   public get classNamePrefixBase(): string {
    return this._classNamePrefixBase;
  }

  private _classNamePrefix: string;
  /**
   * Prefix used for all internally created CSS classes.
   */
  public get classNamePrefix(): string {
    return this._classNamePrefix;
  }

  private classes: StyleClass[] = [];
  private rules: StyleRule[] = [];
  private styleSheet?: HTMLStyleElement;

  /**
   * For cases when you need to add the stylesheet to anything
   * other than document.head (default), set this property
   * before calling `show()`.
   */
  public styleSheetRoot: HTMLElement;

  /**
   * Initializes a new style manager.
   * @param instanceNo - instance id.
   */
  constructor(instanceNo: number) {
    this._classNamePrefix = `${this._classNamePrefixBase}_${instanceNo}_`;
  }

  /**
   * Adds a CSS class declaration.
   * @param styleClass - class to add.
   */
  public addClass(styleClass: StyleClass): StyleClass {
    if (this.styleSheet === undefined) {
      this.addStyleSheet();
    }
    styleClass.name = `${this.classNamePrefix}${styleClass.localName}`;
    this.classes.push(styleClass);
    this.styleSheet.sheet.addRule('.' + styleClass.name, styleClass.style);
    return styleClass;
  }

  /**
   * Add arbitrary CSS rule
   * @param styleRule - CSS rule to add.
   */
  public addRule(styleRule: StyleRule): void {
    if (this.styleSheet === undefined) {
      this.addStyleSheet();
    }
    this.rules.push(styleRule);
    // this.styleSheet.sheet.addRule(styleRule.selector, styleRule.style); // crashes in legacy Edge
    this.styleSheet.sheet.insertRule(
      `${styleRule.selector} {${styleRule.style}}`,
      this.styleSheet.sheet.rules.length
    );
  }

  private addStyleSheet() {
    this.styleSheet = document.createElement('style');
    (this.styleSheetRoot ?? document.head).appendChild(this.styleSheet);
  }

  public removeStyleSheet(): void {
    if (this.styleSheet) {
      (this.styleSheetRoot ?? document.head).removeChild(this.styleSheet);
      this.styleSheet = undefined;
    }
  }
}

/**
 * Represents an arbitrary CSS rule.
 */
export class StyleRule {
  /**
   * CSS selector.
   */
  public selector: string;
  /**
   * Style declaration for the rule.
   */
  public style: string;
  /**
   * Creates an arbitrary CSS rule using the selector and style rules.
   * @param selector - CSS selector
   * @param style - styles to apply
   */
  constructor(selector: string, style: string) {
    this.selector = selector;
    this.style = style; 
  }
}

/**
 * Represents a CSS class.
 */
export class StyleClass {
  /**
   * CSS style rules for the class.
   */
  public style: string;
  
  /**
   * Class name without the global prefix.
   */
  public localName: string;
  /**
   * Fully qualified CSS class name.
   */
  public name: string;

  /**
   * Creates a CSS class declaration based on supplied (local) name and style rules.
   * @param name - local CSS class name (will be prefixed with the marker.js prefix).
   * @param style - style declarations.
   */
  constructor(name: string, style: string) {
    this.localName = name;
    this.style = style; 
  }
}
