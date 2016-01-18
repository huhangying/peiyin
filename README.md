# Bub

IOS 兼容：

1. 播放inline video；
> <video> 中加入 “ playsinline webkit-playsinline”

> 直接修改 “/platforms/ios/CordovaLib/Classes/CDVViewController.m”，加入：

    self.webView.allowsInlineMediaPlayback = YES;
or
    /*
     * This is for iOS 4.x, where you can allow inline <video> and <audio>, and also autoplay them
     */
    if ([allowInlineMediaPlayback boolValue] && [self.webView respondsToSelector:@selector(allowsInlineMediaPlayback)]) {
        self.webView.allowsInlineMediaPlayback = YES;
    }
    if ((mediaPlaybackRequiresUserAction == NO) && [self.webView respondsToSelector:@selector(mediaPlaybackRequiresUserAction)]) {
        self.webView.mediaPlaybackRequiresUserAction = NO;
    }

