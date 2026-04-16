from setuptools import setup, find_packages

setup(
    name="gmgn-sdk",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "requests>=2.28.0",
        "aiohttp>=3.8.0",
        "websockets>=10.0",
        "pydantic>=2.0.0",
        "python-dotenv>=1.0.0"
    ],
    python_requires=">=3.11",
)
