import Route from "@ioc:Adonis/Core/Route";

export default function videosRouter() {
  Route.group(() => {
    Route.shallowResource("sections.videos", "VideosController")
      .apiOnly()
      .paramFor("sections", "section")
      .as("videos")
      .middleware({ "*": ["auth"] });
    Route.post("videos/:id/upload", "VideosController.upload")
      .as("videos.upload")
      .middleware(["auth"]);
    Route.post("videos/:id/reorder", "VideosController.updateOrder")
      .as("videos.reorder")
      .middleware(["auth"]);
    Route.get("videos/:id/watch", "VideosController.watch")
      .as("videos.watch")
      .middleware(["auth"]);
  }).namespace("App/Modules/Videos");
}
