use std::sync::{Arc, Mutex};
use std::thread;
use warp::Filter;

pub fn start_server(content: Arc<Mutex<String>>) -> Result<u16, Box<dyn std::error::Error>> {
    // 获取随机可用端口
    let port = portpicker::pick_unused_port().ok_or("无法找到可用端口")?;

    let content_filter = warp::path::end()
        .and(warp::get())
        .map(move || {
            let html = content.lock().unwrap().clone();
            warp::reply::with_header(
                html,
                "content-type",
                "text/html; charset=utf-8",
            )
        });

    let routes = content_filter;

    // 在新线程中启动服务器
    thread::spawn(move || {
        let rt = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            warp::serve(routes)
                .bind(([127, 0, 0, 1], port))
                .await;
        });
    });

    // 给服务器一点时间启动
    thread::sleep(std::time::Duration::from_millis(100));

    Ok(port)
}
