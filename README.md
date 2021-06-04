# proyek3/akun-keycloak-proxy

Service ini bertujuan untuk mencegat *request* dari service kepada *keycloak* untuk dimanipulasi terlebih dahulu sebelum diteruskan. 

```
 +-----------+        +------------------------------+        +----------+
 | service-x | <----> | @proyek3/akun-keycloak-proxy | <----> | Keycloak |
 +-----------+        +------------------------------+        +----------+ 
```

Service ini digunakan untuk memanipulasi *request* yang berkaitan dengan *login* agar alur login publik dapat digantikan menggunakan frontend vue.
