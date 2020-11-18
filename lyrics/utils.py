import re
import unicodedata

def words_tokenizer(str):
  regex = []

  # chinese, japanese, korean characters
  regex.append(r"[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u203B\u4E00-\u9FFF\u3400-\u4DFF\uac00-\ud7ff]")

  regex.append(r'[a-zA-Z0-9@\-_\'\"]+\'*[a-z]*') # english words
  regex.append(r"[0-9]+") # numbers
  regex.append(r"[.,!?;]") # punctuations
  regex.append(r"[\s+]") # space

  regex = '|'.join(regex)

  return re.findall(regex, str, re.UNICODE)
