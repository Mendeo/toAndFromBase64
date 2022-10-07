# Перевод двоичных файлов в base64 и обратно.

При переводе в base64 в выходной файл сохраняются дата создания, имя исходного файла и md5 хэш, который используется для проверки корректности обратного преобразования.

В аргументах коммандной строки нужно передать:
* для "to.js" - путь к файлу, который нужно перевести в base64. Затем, опционально, путь к выходному файлу.
* для "from.js" - путь к файлу, который нужно расшифровать из base64.
