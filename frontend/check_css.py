import re

css_path = r"d:\Downloads\Server\Backup\stat\frontend\dist\assets\index-BfDzX2v0.css"
with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

rules = css.split("}")
for rule in rules:
    if "bg-brand" in rule and "background" in rule:
        print(rule.strip()[:200])
        print("---")
