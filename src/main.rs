use clap::Parser;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tao::{
    event::{Event, StartCause, WindowEvent},
    event_loop::{ControlFlow, EventLoop},
    window::WindowBuilder,
};
use wry::webview::WebViewBuilder;

mod renderer;
mod server;

use renderer::render_markdown;
use server::start_server;

#[derive(Parser, Debug)]
#[command(
    name = "paper",
    about = "极速 Markdown 预览 CLI 工具 - Rust + WebView",
    version = "1.0.0"
)]
struct Cli {
    /// Markdown 文件路径
    #[arg(value_name = "FILE")]
    file: Option<PathBuf>,
}

fn main() {
    let cli = Cli::parse();

    // 如果没有提供文件，显示帮助
    let file_path = match cli.file {
        Some(path) => path,
        None => {
            eprintln!("{}[paper] 错误: 请提供 Markdown 文件路径{}", "\x1b[31m", "\x1b[0m");
            eprintln!("{}[paper] 用法: paper <file.md>{}", "\x1b[36m", "\x1b[0m");
            std::process::exit(1);
        }
    };

    // 检查文件是否存在
    if !file_path.exists() {
        eprintln!(
            "{}[paper] 错误: 文件不存在: {:?}{}",
            "\x1b[31m",
            file_path,
            "\x1b[0m"
        );
        std::process::exit(1);
    }

    // 初始渲染
    let html = match render_markdown(&file_path) {
        Ok(h) => h,
        Err(e) => {
            eprintln!("{}[paper] 渲染失败: {}{}", "\x1b[31m", e, "\x1b[0m");
            std::process::exit(1);
        }
    };

    let content = Arc::new(Mutex::new(html));

    // 启动 HTTP 服务器
    let port = match start_server(content.clone()) {
        Ok(p) => p,
        Err(e) => {
            eprintln!("{}[paper] 启动服务器失败: {}{}", "\x1b[31m", e, "\x1b[0m");
            std::process::exit(1);
        }
    };

    let url = format!("http://localhost:{}", port);
    let file_name = file_path.file_name().unwrap().to_str().unwrap();

    println!(
        "{}╔════════════════════════════════════════════════╗{}",
        "\x1b[36m", "\x1b[0m"
    );
    println!("{}║              [paper] 数字宣纸                  ║{}", "\x1b[36m", "\x1b[0m");
    println!("{}╠════════════════════════════════════════════════╣{}", "\x1b[36m", "\x1b[0m");
    println!("{}║ 正在为您展开纸张...                            ║{}", "\x1b[36m", "\x1b[0m");
    println!(
        "{}║ 文件: {}{:<35}║{}",
        "\x1b[36m",
        "\x1b[33m",
        file_name,
        "\x1b[0m"
    );
    println!("{}║ 地址: {}{:<35}║{}", "\x1b[36m", "\x1b[32m", url, "\x1b[0m");
    println!("{}╠════════════════════════════════════════════════╣{}", "\x1b[36m", "\x1b[0m");
    println!("{}║ 关闭窗口即可退出                               ║{}", "\x1b[36m", "\x1b[0m");
    println!("{}╚════════════════════════════════════════════════╝{}", "\x1b[36m", "\x1b[0m");
    println!();
    println!("{}[paper] 窗口已打开 ✓{}", "\x1b[32m", "\x1b[0m");

    // 创建窗口和 WebView
    let event_loop = EventLoop::new();
    let window = WindowBuilder::new()
        .with_title(&format!("Paper - {}", file_name))
        .with_inner_size(tao::dpi::LogicalSize::new(960.0, 800.0))
        .with_min_inner_size(tao::dpi::LogicalSize::new(640.0, 480.0))
        .build(&event_loop)
        .expect("创建窗口失败");

    let _webview = WebViewBuilder::new(window)
        .expect("创建 WebViewBuilder 失败")
        .with_url(&url)
        .expect("设置 URL 失败")
        .build()
        .expect("创建 WebView 失败");

    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;

        if let Event::WindowEvent {
            event: WindowEvent::CloseRequested,
            ..
        } = event
        {
            *control_flow = ControlFlow::Exit;
        }
    });
}
