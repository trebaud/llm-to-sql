/// <reference path="../pb_data/types.d.ts" />
$app.rootCmd?.addCommand(
  new Command({
    use: "query",
    run: (_cmd, args) => {
      console.log(args);
    },
  }),
);
