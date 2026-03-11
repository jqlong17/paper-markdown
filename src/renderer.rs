use pulldown_cmark::{html, Options, Parser};
use std::path::Path;
use std::fs;

pub fn render_markdown(file_path: &Path) -> Result<String, Box<dyn std::error::Error>> {
    // 读取文件内容
    let markdown_content = fs::read_to_string(file_path)?;

    // 配置 Markdown 解析选项
    let mut options = Options::empty();
    options.insert(Options::ENABLE_STRIKETHROUGH);
    options.insert(Options::ENABLE_TABLES);
    options.insert(Options::ENABLE_FOOTNOTES);
    options.insert(Options::ENABLE_TASKLISTS);
    options.insert(Options::ENABLE_SMART_PUNCTUATION);

    // 解析 Markdown
    let parser = Parser::new_ext(&markdown_content, options);
    let mut html_content = String::new();
    html::push_html(&mut html_content, parser);

    // 获取文件名
    let file_name = file_path
        .file_name()
        .unwrap_or_default()
        .to_str()
        .unwrap_or("unknown");

    // 生成完整的 HTML 页面
    let html = format!(
        r#"<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{} - Paper</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap');
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        html {{
            scrollbar-width: none;
            -ms-overflow-style: none;
        }}
        
        html::-webkit-scrollbar {{
            display: none;
        }}
        
        body {{
            font-family: "Noto Serif SC", "Source Han Serif SC", "Georgia", serif;
            background-color: #F9F8F2;
            color: #333333;
            line-height: 1.8;
            letter-spacing: 0.03em;
            opacity: 0;
            animation: inkSpread 1.2s ease-out forwards;
        }}
        
        @keyframes inkSpread {{
            0% {{
                opacity: 0;
                filter: blur(2px);
            }}
            50% {{
                opacity: 0.5;
                filter: blur(1px);
            }}
            100% {{
                opacity: 1;
                filter: blur(0);
            }}
        }}
        
        .container {{
            max-width: 720px;
            margin: 0 auto;
            padding: 120px 40px;
        }}
        
        h1, h2, h3, h4, h5, h6 {{
            font-weight: 600;
            margin: 1.8em 0 0.8em 0;
            line-height: 1.4;
            color: #2a2a2a;
        }}
        
        h1 {{
            font-size: 2.2em;
            margin-top: 0;
            padding-bottom: 0.3em;
        }}
        
        h2 {{
            font-size: 1.8em;
        }}
        
        h3 {{
            font-size: 1.5em;
        }}
        
        h4 {{
            font-size: 1.3em;
        }}
        
        p {{
            margin: 1em 0;
            text-align: justify;
        }}
        
        a {{
            color: #4A69BD;
            text-decoration: none;
            transition: color 0.2s ease;
        }}
        
        a:hover {{
            color: #3a5699;
            text-decoration: underline;
        }}
        
        blockquote {{
            margin: 1.5em 0;
            padding-left: 1.5em;
            border-left: 1px solid #DDD;
            color: #555;
            font-style: italic;
        }}
        
        code {{
            font-family: "SF Mono", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace;
            background-color: rgba(0, 0, 0, 0.03);
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-size: 0.9em;
        }}
        
        pre {{
            background-color: rgba(0, 0, 0, 0.03);
            padding: 1em;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1.2em 0;
        }}
        
        pre code {{
            background: none;
            padding: 0;
        }}
        
        ul, ol {{
            margin: 1em 0;
            padding-left: 1.8em;
        }}
        
        li {{
            margin: 0.3em 0;
        }}
        
        img {{
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 1.5em 0;
        }}
        
        hr {{
            border: none;
            border-top: 1px solid #DDD;
            margin: 2em 0;
        }}
        
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
        }}
        
        th, td {{
            padding: 0.6em 0.8em;
            text-align: left;
            border-bottom: 1px solid #E5E5E5;
        }}
        
        th {{
            font-weight: 600;
            color: #2a2a2a;
            border-bottom: 2px solid #DDD;
        }}
        
        strong {{
            font-weight: 700;
            color: #2a2a2a;
        }}
        
        .empty-state {{
            text-align: center;
            color: #888;
            padding: 4em 0;
            font-style: italic;
        }}
        
        .footer {{
            margin-top: 4em;
            padding-top: 2em;
            border-top: 1px solid #E5E5E5;
            text-align: center;
            color: #999;
            font-size: 0.85em;
        }}
    </style>
</head>
<body>
    <div class="container">
        {}
        <div class="footer">
            <p>Rendered by Paper · {}</p>
        </div>
    </div>
</body>
</html>
"#,
        file_name,
        html_content,
        file_name
    );

    Ok(html)
}
