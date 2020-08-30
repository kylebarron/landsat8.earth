## Notes on using single vs dual deck instances for 2d/3d modes

Currently I have two modes, 2d and 3d, that use their own deck instances for
rendering. This is suboptimal because any time you switch between 2d and 3d, you
need to discard the Deck instance and create a new one with a new GL context.
That takes a second or so.

Ideally you would have both rendered using the same Deck instance. This is hard,
however, because I use the `MapboxLayer`. Therefore in 2d mode, Deck and Mapbox
GL draw into the same GL context. This means that when you switch to 3d mode,
you can't remove Mapbox GL because it's tied to the context. I've found that in
3d mode performance is much better when you only have deck.gl and not Mapbox as
well.

I also found issues when switching from 2d to 3d mode and back again. It's
important for `map.addLayer(customDeckLayer)` to only be called once, but when I
tried to conditionally render `StaticMap`, that would be called every time you
switch back to 3d mode, and I had various rendering issues.

In the end, the best approach was to _always_ show `StaticMap`, but change the
number of Mapbox layers shown, based on whether it was 2d or 3d rendering. In 2d
mode, I found it was necessary to only render layers _above_ the Landsat layer.
Otherwise you'd have bad rendering artifacts when switching from 2d to 3d and
back to 2d. In 3d mode, you need to render essentially no Mapbox layers so that
vector layers aren't drawn in 3d mode. You can do this by switching the
`mapStyle` between 2d and 3d modes. You still need a couple layers in 3d mode,
including the `beforeId` layer (which I set to opacity 0).

In the end, however, I found that performance in 3d mode wasn't ideal, and was
significantly poorer than in 3d mode with dual deck instances for 2d and 3d
mode. Additionally, Mapbox GL JS currently has a max pitch of 60. To have a
higher max pitch you need to use private APIs to set Mapbox's max pitch value,
and then performance isn't great above 60 degrees.

You can find a WIP example on the
[`single-deck-instance`](https://github.com/kylebarron/landsat8.earth/tree/single-deck-instance)
branch.
