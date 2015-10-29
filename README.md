# react-webpack-scaffolding

## How to get started

1. Start your own project folder with a git clone then git init

    ```sh
    cd ~/Code/
    hub clone jacobthemyth/react-webpack-scaffolding NEWPROJECT
    cd NEWPROJECT
    rm -rf .git
    git init
    git add .
    git commit -m "Initial commit"
    ```

2. Install prerequisites

    ```sh
    npm install
    ```

3. Start watching for changes and develop it!

    ```sh
    gulp
    ```

## Usage

### Images

Images should be placed in `public/assets/images`

#### In JS / JSX

```jsx
import mountains from 'assets/images/mountains.jpeg';

var Thing = React.createClass({
  render() {
    return (
      <img src={mountains} alt="Mountains" />
    );
  }
});
```

#### In SCSS

URLs are relative to `app.scss`

```scss
body {
  background-image: url('../../public/assets/images/mountains.jpeg');
}
```

## License

MIT.
