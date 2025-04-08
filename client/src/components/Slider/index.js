import React from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import "./styles.css"

function Slider() {
    const [sliderRef] = useKeenSlider(
        {
            loop: true,
        },
        [
            (slider) => {
                let timeout
                let mouseOver = false
                function clearNextTimeout() {
                    clearTimeout(timeout)
                }
                function nextTimeout() {
                    clearTimeout(timeout)
                    if (mouseOver) return
                    timeout = setTimeout(() => {
                        slider.next()
                    }, 3000)
                }
                slider.on("created", () => {
                    slider.container.addEventListener("mouseover", () => {
                        mouseOver = true
                        clearNextTimeout()
                    })
                    slider.container.addEventListener("mouseout", () => {
                        mouseOver = false
                        nextTimeout()
                    })
                    nextTimeout()
                })
                slider.on("dragStarted", clearNextTimeout)
                slider.on("animationEnded", nextTimeout)
                slider.on("updated", nextTimeout)
            },
        ]
    )

    return (
        <>
            <div ref={sliderRef} className="keen-slider">
                <div className="keen-slider__slide number-slide1">
                    <img src="https://i.pinimg.com/originals/da/01/07/da01079128fe7d6ccc366f3b691156a9.jpg" className="keen-slider__img" alt=""></img>
                </div>
                <div className="keen-slider__slide number-slide2">
                    <img src="https://cdn.dribbble.com/users/722246/screenshots/2105878/attachments/380895/Bays_Nights.jpg" className="keen-slider__img" alt=""></img>

                </div>
                <div className="keen-slider__slide number-slide3">
                    <img src="https://i.pinimg.com/1200x/73/4d/ad/734dadccc7e71b8b01bd9d595d64402f.jpg" className="keen-slider__img" alt=""></img>

                </div>
                <div className="keen-slider__slide number-slide4">
                    <img src="https://i.pinimg.com/1200x/d1/6f/48/d16f481870cb4d70ad288d952c1c1d9c.jpg" className="keen-slider__img" alt=""></img>

                </div>
                <div className="keen-slider__slide number-slide5">
                    <img src="https://i.pinimg.com/1200x/f8/d8/ea/f8d8ea0314a557e78dd4d625c82937c5.jpg" className="keen-slider__img" alt=""></img>

                </div>
                <div className="keen-slider__slide number-slide6">
                    <img src="https://i.pinimg.com/1200x/08/3e/fe/083efeaaa49456d3952a7232e736a876.jpg" className="keen-slider__img" alt=""></img>

                </div>
            </div>
        </>
    )
}

export default Slider;