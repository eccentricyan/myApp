import { Directive, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import { Keyboard } from "@ionic-native/keyboard";
import { Content, Platform } from "ionic-angular";
import { Observable } from "rxjs/Observable";

import { Subscription } from "rxjs/Subscription";
import "rxjs/add/observable/timer";
@Directive({
  selector: "[keyboard-attach]" // Attribute selector
})
export class KeyboardAttachDirective implements OnInit, OnDestroy {
  @Input("keyboard-attach") content: Content;

  private onShowSubscription: Subscription;
  private onHideSubscription: Subscription;
  private onShowWindowSubscription: Subscription;

  constructor(
    private elementRef: ElementRef,
    private keyboard: Keyboard,
    private platform: Platform
  ) {}

  ngOnInit() {
    if (this.platform.is("cordova") && this.platform.is("ios")) {
      this.keyboard
        .onKeyboardShow()
        .subscribe(e => this.onShow(e));
      this.keyboard
        .onKeyboardHide()
        .subscribe(() => this.onHide());
    }
  }

  ngOnDestroy() {
    if (this.onShowSubscription) this.onShowSubscription.unsubscribe();
    if (this.onShowWindowSubscription)
      this.onShowWindowSubscription.unsubscribe();
    if (this.onHideSubscription) this.onHideSubscription.unsubscribe();
  }

  private onShow(e) {
    this.elementRef.nativeElement.style.backgroundColor = "pink";
    // this.elementRef.nativeElement.style.height = "900px";
    const keyboardHeight: number =
      e.keyboardHeight || (e.detail && e.detail.keyboardHeight);
    this.setElementPosition(keyboardHeight);
    this.keyboard.disableScroll(true);
  }

  private onHide() {
    this.setElementPosition(0);
    this.keyboard.disableScroll(false);
  }

  private setElementPosition(pixels: number) {
    this.elementRef.nativeElement.style.paddingBottom = pixels + "px";
    this.content.resize();

    this.onShowWindowSubscription = Observable.timer(0, 1).subscribe(() => {
      if (window.pageYOffset !== 0) {
        window.scrollTo(0, 0);
        this.onShowWindowSubscription.unsubscribe();

        setTimeout(() => {
          this.content.scrollToBottom(0);
        }, 100);
      }
    });
  }
}
