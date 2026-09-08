package se.lexicon.flightreservationai.entity;

import jakarta.persistence.*;
        import lombok.*;

@Entity
@Table(name = "passengers")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private boolean isChild;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    // Constructors
    public Passenger() {
    }

    public Passenger(String name, boolean isChild, Booking booking) {
        this.name = name;
        this.isChild = isChild;
        this.booking = booking;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isChild() {
        return isChild;
    }

    public void setChild(boolean isChild) {
        this.isChild = isChild;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    @Override
    public String toString() {
        return "Passenger{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", isChild=" + isChild +
                '}';
    }
}
