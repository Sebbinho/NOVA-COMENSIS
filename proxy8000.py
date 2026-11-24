import socket
import threading

LISTEN_HOST = '0.0.0.0'
LISTEN_PORT = 8000
REMOTE_HOST = '127.0.0.1'
REMOTE_PORT = 3000

print(f"Starting TCP proxy {LISTEN_HOST}:{LISTEN_PORT} -> {REMOTE_HOST}:{REMOTE_PORT}")


def handle_client(client_sock, client_addr):
    try:
        remote = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        remote.connect((REMOTE_HOST, REMOTE_PORT))
    except Exception as e:
        try:
            client_sock.sendall(b"HTTP/1.1 502 Bad Gateway\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: 11\r\n\r\nBad Gateway")
        except:
            pass
        client_sock.close()
        return

    def forward(src, dst):
        try:
            while True:
                data = src.recv(4096)
                if not data:
                    break
                dst.sendall(data)
        except Exception:
            pass
        finally:
            try:
                dst.shutdown(socket.SHUT_RDWR)
            except Exception:
                pass

    t1 = threading.Thread(target=forward, args=(client_sock, remote))
    t2 = threading.Thread(target=forward, args=(remote, client_sock))
    t1.start()
    t2.start()
    t1.join()
    t2.join()
    try:
        client_sock.close()
    except:
        pass
    try:
        remote.close()
    except:
        pass


sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind((LISTEN_HOST, LISTEN_PORT))
sock.listen(100)
print("Proxy listening, press Ctrl-C to stop")

try:
    while True:
        client, addr = sock.accept()
        t = threading.Thread(target=handle_client, args=(client, addr))
        t.daemon = True
        t.start()
except KeyboardInterrupt:
    print("Shutting down proxy")
    sock.close()
