JSBridge 是一种用于在 JavaScript 和原生应用（如 iOS 和 Android）之间进行通信的技术。它允许 JavaScript 调用原生代码，反之亦然，从而实现混合应用程序的开发。JSBridge 通常用于在 WebView 中运行的 JavaScript 和宿主应用程序之间进行通信。

### 为什么使用 JSBridge？

1. **跨平台开发**：通过 JSBridge，可以在一个代码库中编写大部分逻辑，并在多个平台上运行。
2. **性能优化**：某些操作可以通过原生代码实现，以提高性能。
3. **访问原生功能**：通过 JSBridge，可以访问设备的原生功能，如相机、文件系统等。

### JSBridge 的基本原理

JSBridge 的基本原理是通过 WebView 提供的接口，实现 JavaScript 和原生代码之间的通信。通常有两种主要的通信方式：

1. **JavaScript 调用原生代码**：通过特定的 URL scheme 或者注入的对象，JavaScript 可以调用原生代码。
2. **原生代码调用 JavaScript**：通过 WebView 提供的接口，原生代码可以执行 JavaScript 代码。

### 实现一个简单的 JSBridge

下面是一个简单的 JSBridge 实现示例，包括 JavaScript 和原生代码部分。

#### JavaScript 部分

首先，我们需要在 JavaScript 中定义一个桥接对象，用于与原生代码进行通信。

```javascript
// jsbridge.js
(function(window) {
  var JSBridge = {
    call: function(method, params, callback) {
      var callbackId = 'cb_' + (new Date()).getTime() + '_' + Math.random().toString(36).substr(2, 5);
      if (callback) {
        JSBridge.callbacks[callbackId] = callback;
      }
      var message = {
        method: method,
        params: params,
        callbackId: callbackId
      };
      window.webkit.messageHandlers.JSBridge.postMessage(message);
    },
    callbacks: {},
    _handleMessageFromNative: function(message) {
      var callback = JSBridge.callbacks[message.callbackId];
      if (callback) {
        callback(message.data);
        delete JSBridge.callbacks[message.callbackId];
      }
    }
  };

  window.JSBridge = JSBridge;
})(window);
```

在这个示例中，我们定义了一个 `JSBridge` 对象，并将其挂载到 `window` 对象上。`JSBridge.call` 方法用于调用原生代码，`JSBridge._handleMessageFromNative` 方法用于处理原生代码的回调。

#### iOS 原生代码部分

在 iOS 中，我们可以使用 `WKWebView` 和 `WKScriptMessageHandler` 来实现 JSBridge。

```objective-c
// ViewController.m
#import "ViewController.h"
#import <WebKit/WebKit.h>

@interface ViewController () <WKScriptMessageHandler>
@property (nonatomic, strong) WKWebView *webView;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
    [config.userContentController addScriptMessageHandler:self name:@"JSBridge"];
    
    self.webView = [[WKWebView alloc] initWithFrame:self.view.bounds configuration:config];
    [self.view addSubview:self.webView];
    
    NSString *htmlPath = [[NSBundle mainBundle] pathForResource:@"index" ofType:@"html"];
    NSURL *htmlURL = [NSURL fileURLWithPath:htmlPath];
    [self.webView loadFileURL:htmlURL allowingReadAccessToURL:htmlURL];
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    if ([message.name isEqualToString:@"JSBridge"]) {
        NSDictionary *body = message.body;
        NSString *method = body[@"method"];
        NSDictionary *params = body[@"params"];
        NSString *callbackId = body[@"callbackId"];
        
        if ([method isEqualToString:@"nativeMethod"]) {
            // 调用原生方法
            NSString *result = [self nativeMethod:params];
            
            // 回调 JavaScript
            NSString *js = [NSString stringWithFormat:@"JSBridge._handleMessageFromNative({callbackId: '%@', data: '%@'})", callbackId, result];
            [self.webView evaluateJavaScript:js completionHandler:nil];
        }
    }
}

- (NSString *)nativeMethod:(NSDictionary *)params {
    // 实现原生方法
    return @"Hello from native!";
}

@end
```

在这个示例中，我们创建了一个 `WKWebView`，并通过 `WKScriptMessageHandler` 接收来自 JavaScript 的消息。我们在 `userContentController:didReceiveScriptMessage:` 方法中处理这些消息，并调用相应的原生方法。最后，我们通过 `evaluateJavaScript:completionHandler:` 方法将结果回调给 JavaScript。

#### Android 原生代码部分

在 Android 中，我们可以使用 `WebView` 和 `JavascriptInterface` 来实现 JSBridge。

```java
// MainActivity.java
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebChromeClient(new WebChromeClient());
        webView.addJavascriptInterface(new JSBridge(), "JSBridge");

        webView.loadUrl("file:///android_asset/index.html");
    }

    public class JSBridge {
        @JavascriptInterface
        public void call(String method, String params, String callbackId) {
            if ("nativeMethod".equals(method)) {
                // 调用原生方法
                String result = nativeMethod(params);

                // 回调 JavaScript
                final String js = String.format("JSBridge._handleMessageFromNative({callbackId: '%s', data: '%s'})", callbackId, result);
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        webView.evaluateJavascript(js, null);
                    }
                });
            }
        }

        private String nativeMethod(String params) {
            // 实现原生方法
            return "Hello from native!";
        }
    }
}
```

在这个示例中，我们创建了一个 `WebView`，并通过 `addJavascriptInterface` 方法将 `JSBridge` 对象注入到 JavaScript 中。我们在 `JSBridge` 类中定义了一个 `call` 方法，用于接收来自 JavaScript 的消息，并调用相应的原生方法。最后，我们通过 `evaluateJavascript` 方法将结果回调给 JavaScript。

### 总结

JSBridge 是一种强大的技术，用于在 JavaScript 和原生应用之间进行通信。通过 JSBridge，我们可以在混合应用程序中实现跨平台开发、性能优化和访问原生功能。希望这个详细的讲解能帮助你更好地理解和使用 JSBridge。
