#フォルダ構成  
server　サーバコード(python)  
static　HTMLや画像等の静的ファイル  
static/js　クライアントコード
templates　HTMLテンプレートファイル  
other　ドキュメントやテーブル定義等  
main.py メインモジュール
test.py　テストモジュール

#インストール方法
##Flaskをインストール
###方法１
    sudo easy_install Werkzeug
    sudo easy_install Jinja2
    sudo easy_install Flask
###方法２
    sudo easy_install pip
    sudo pip install Flask

##MySQLdbをインストール
http://mysql-python.sourceforge.net/  

##makoをインストール
    sudo easy_install mako  

#実行方法
##前準備
1.データベースにテーブル情報をインポートする
    > mysql -u root 
    mysql> CREATE DATABASE l_clooca;
    mysql> exit
    
    > mysql -u root --default-character-set=utf8 l_clooca < l_clooca.sql

2.config.pyをデータベースにあわせて設定
    DB_NAME = 'l_clooca'
    DB_HOST = 'localhost'
    DB_PORT = 3306
    DB_USER = 'root'
    DB_PASSWD = ''
##実行
1.'python clooca.py'で実行
2.http://127.0.0.1:5000/ にアクセス
